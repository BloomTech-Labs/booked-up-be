const { check, validationResult, body } = require("express-validator");
const Users = require("../users/user-model");
const checkRole = require("../check-role/check-role-user");
const restricted = require("../auth/restricted");

exports.validateUserId = [
  check("id")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Users.findById(value).then((user) => {
        if (user === undefined) {
          return Promise.reject("User not found");
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
