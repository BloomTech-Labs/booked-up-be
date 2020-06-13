const { check, validationResult, body } = require("express-validator");
const Users = require("../users/user-model");
const Contents = require("./content-model");
const checkRole = require("../check-role/check-role-user");
const restricted = require("../auth/restricted");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

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

exports.validateUpdateContent = [
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
  check("contentId")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Contents.findByIdContent(value).then((user) => {
        if (user.length === 0) {
          return Promise.reject("Content not found on server");
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

exports.validateDeleteContent = [
  check("id")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Contents.findByIdContent(value).then((user) => {
        if (user.length === 0) {
          return Promise.reject("Content not found on server");
        }
      })
    ),
  check("cloudId").custom((value, { req, loc, path }) =>
    cloudinary.v2.api.resource(value, (error, success) => {
      try {
        Promise.resolve(success);
      } catch (err) {
        Promise.reject(error);
      }
    })
  ),
  restricted,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
