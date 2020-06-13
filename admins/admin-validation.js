const { check, validationResult, body } = require("express-validator");
const Admins = require("./admin-model");
const checkRole = require("../check-role/check-role-admin.js");
const restricted = require("../auth/restricted");

exports.validateUpdatePassword = [
  check(
    "password",
    "Must contain 8 characters - one uppercase, one lowercase, one number, one special"
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  check("id")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Admins.findById(value).then((user) => {
        if (user === undefined) {
          return Promise.reject("Admin Id not found");
        }
      })
    ),
  restricted,
  checkRole(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

// Update Email

exports.validateUpdateEmail = [
  check("email", "Must be a valid email").isEmail(),
  body("email").custom((value, { req, loc, path }) =>
    Admins.findByEmail(value).then((user) => {
      if (user.length === 0) {
        return null;
      }
      if (
        user[0].email === value &&
        Object.is(Number(req.params.id), user[0].id)
      ) {
        return Promise.reject("Please choose a new email");
      }
      if (user.length > 0) {
        return Promise.reject("email already registered");
      }
    })
  ),
  restricted,
  checkRole(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
