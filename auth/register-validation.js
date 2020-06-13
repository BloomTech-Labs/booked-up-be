const { check, validationResult, body } = require("express-validator");
const Users = require("../users/user-model.js");

exports.validateRegister = [
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

// Resend email

exports.validateResendEmail = [
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
