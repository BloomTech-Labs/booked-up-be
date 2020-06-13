const bcrypt = require("bcryptjs");
const jwtDecode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const {
  sendConfirmationEmail,
} = require("../services/user-email-confirmation.js");
const Users = require("../users/user-model.js");
const secrets = require("../config/secrets.js");

exports.register = [
  (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;
    Users.add(user)
      .then((u) => {
        sendConfirmationEmail(u);
        res.status(201).json({ message: "email sent" });
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

exports.resendRegister = [
  (req, res) => {
    Users.findByEmail(req.body.email)
      .then((u) => {
        sendConfirmationEmail(u[0]);
        res.status(201).json({ message: "email sent" });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

// Get and confirm resend email

exports.getAndConfirmEmail = [
  async (req, res) => {
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
  },
];
