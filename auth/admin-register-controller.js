const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const secrets = require("../config/secrets.js");
const bcrypt = require("bcryptjs");
const Admins = require("../admins/admin-model.js");
const {
  sendConfirmationEmailAdmin,
} = require("../services/admin-email-registration");

exports.register = [
  (req, res) => {
    const { email, id } = req.body;
    Admins.findBy({ email })
      .first()
      .then((u) => {
        if (u) {
          sendConfirmationEmailAdmin(u);
          res.status(200).json({ message: "email sent" });
        }
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

exports.registerSetPassword = [
  async (req, res) => {
    const decodedJwt = jwtDecode(req.params.token);

    jwt.verify(req.params.token, secrets.jwtSecret, (err, verifiedJWT) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.render("admin-password-confirmation", {
          error: req.flash("error"),
          data: {
            id: decodedJwt.userid,
            token: req.params.token,
            type: decodedJwt.userType,
          },
        });
      }
    });
  },
];

exports.registerPasswordReset = [
  (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 12);
    const updateUser = {
      email_verification: true,
      password: hash,
    };
    jwt.verify(req.body.token, secrets.jwtSecret, (err, verifiedJWT) => {
      if (err) {
        res.status(400).json(err);
      } else {
        Admins.update(req.body.id, updateUser)
          .then((u) => {
            res.render("admin-password-success");
          })
          .catch((err) => {
            res.status(400).json(err.message);
          });
      }
    });
  },
];
