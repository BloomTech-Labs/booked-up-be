const { check, validationResult, body } = require("express-validator");
const Users = require("../users/user-model.js");

// Login using email or display_name

exports.validateLogin = [
  body("login").custom((value, { req, loc, path }) => {
    if (value.indexOf("@") !== -1) {
      return Users.findByEmail(value).then((user) => {
        const newUser = user.map((u) => u.email_verification);
        if (
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) === false
        ) {
          return Promise.reject("please input a valid email");
        }
        if (user.length === 0) {
          return Promise.reject("email not registered");
        }
        if (newUser[0] === false) {
          return Promise.reject("email has not been validated");
        }
      });
    }
    return Users.findByDisplayName(value).then((user) => {
      const displayUser = user.map((u) => u.email_verification);
      if (value.length === 0) {
        return Promise.reject("login field required");
      }
      if (/\s/.test(value) === true) {
        return Promise.reject("please enter a valid display name");
      }
      if (user.length === 0) {
        return Promise.reject("display name not registered");
      }
      if (displayUser[0] === false) {
        return Promise.reject("user has not been validated");
      }
    });
  }),
  check("password", "password field is required").not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
