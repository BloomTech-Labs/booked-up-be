const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult, body } = require("express-validator");
const jwtDecode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const {
  sendConfirmationEmail,
} = require("../services/user-email-confirmation.js");
const Users = require("../users/user-model.js");
const secrets = require("../config/secrets.js");

router.post(
  "/",
  [
    check("email", "Must be a valid email").isEmail(),
    check(
      "password",
      "Must contain 8 characters - one uppercase, one lowercase, one number, one special"
    ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
    check("user_type", "must be either author, fan or agent").isIn([
      "author",
      "agent",
      "fan",
    ]),
    check("first_name", "first name must contain only letters or dashes")
      .trim()
      .matches(/^[a-zA-Z-]+$/),
    check("last_name", "last name must contain only letters or dashes")
      .trim()
      .matches(/^[a-zA-Z-]+$/),
    check("city", "enter a valid city name")
      .optional()
      .trim()
      .matches(/^[a-zA-Z-]+$/),
    check("state", "enter a valid state name")
      .optional()
      .trim()
      .matches(/^[a-zA-Z-]+$/),
    check("country", "enter a valid country name")
      .optional()
      .trim()
      .matches(/^[a-zA-Z-]+$/),
    check("avatar_url", "url for avatar image").optional().trim().notEmpty(),
    check("display_name", "display name must be between 1 and 30 characters")
      .optional()
      .trim()
      .isLength({ min: 1, max: 30 }),
    check(
      "display_name",
      "display name can only contain letters, numbers and underscores"
    )
      .optional()
      .matches(/^\w+$/),
    body("display_name")
      .optional()
      .custom((value) =>
        Users.findByDisplayName(value).then((user) => {
          if (user.length > 0) {
            return Promise.reject("display name already in use");
          }
        })
      ),
    body("email").custom((value) =>
      Users.findByEmail(value).then((user) => {
        if (user.length > 0) {
          return Promise.reject("email already registered");
        }
      })
    ),
  ],
  (req, res) => {
    const errors = validationResult(req);
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }
    Users.add(user)
      .then((u) => {
        sendConfirmationEmail(u);
        res.status(201).json({ message: "email sent" });
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  }
);

// Resend email registration link

router.post(
  "/resendConfirm",
  [
    check("email", "Must be a valid email").isEmail(),
    body("email").custom((value) =>
      Users.findByEmail(value).then((user) => {
        const emailConf = user.map((u) => u.email_verification);
        if (user.length === 0) {
          return Promise.reject("email not registered");
        }
        if (emailConf[0] === true) {
          return Promise.reject("email has already been validated");
        }
      })
    ),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }
    Users.findByEmail(req.body.email)
      .then((u) => {
        sendConfirmationEmail(u[0]);
        res.status(201).json({ message: "email sent" });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
);

router.get("/confirmation/:token", async (req, res) => {
  const updateUser = {
    email_verification: true,
  };
  const decodedJwt = jwtDecode(req.params.token);

  jwt.verify(req.params.token, secrets.jwtSecret, (err, verifiedJWT) => {
    if (err) {
      res.status(400).json(err);
    } else {
      Users.update(decodedJwt.userid, updateUser)
        .then((u) => {
          res.render("user-registration-success");
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  });
});

module.exports = router;
