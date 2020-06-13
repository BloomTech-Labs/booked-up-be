const { check, validationResult, body } = require("express-validator");
const Admins = require("../admins/admin-model.js");

exports.validateRegister = [
  check("email", "email field is required").not().isEmpty(),
  check("email", "a valid email is required").isEmail(),
  body("email").custom((value) =>
    Admins.findByAdmin(value).then((user) => {
      const emailConf = user.map((u) => u.email_verification);
      if (user.length === 0) {
        return Promise.reject("email not registered");
      }
      if (emailConf[0] === true) {
        return Promise.reject("email already validated");
      }
    })
  ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validatePasswordReset = [
  check("password", "Please enter a password").custom(
    (value, { req, loc, path }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("Passwords do not match");
      } else {
        return value;
      }
    }
  ),
  check(
    "password",
    "Must contain 8 characters - one uppercase, one lowercase, one number, one special"
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  (req, res, next) => {
    const errors = validationResult(req);

    const errArr = errors.array();
    const errMsg = errArr.map((err) => `  ${err.msg}`);
    if (!errors.isEmpty()) {
      req.flash("error", errMsg);
      return res.redirect("back");
    }
    next();
  },
];
