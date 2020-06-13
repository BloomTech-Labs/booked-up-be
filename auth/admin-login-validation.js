const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult, body } = require("express-validator");
const Admins = require("../admins/admin-model");

exports.validateAdminLogin = [
  check("email", "email field is required").not().isEmpty(),
  check("email", "a valid email is required").isEmail(),
  body("email").custom((value) =>
    Admins.findByEmail(value).then((user) => {
      const newAdmin = user.map((u) => u.email_verification);
      if (user.length === 0) {
        return Promise.reject("email not registered");
      }
      if (newAdmin[0] === false) {
        return Promise.reject("email has not been validated");
      }
    })
  ),
  check("password", "password field is required").not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
