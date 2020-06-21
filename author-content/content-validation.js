const { check, validationResult, body } = require("express-validator");
const cloudinary = require("cloudinary");
const Users = require("../users/user-model");
const Contents = require("./content-model");
const checkRole = require("../check-role/check-role-user");
const restricted = require("../auth/restricted");
const cloudinaryConfig = require("../config/cloudinary");

cloudinaryConfig;

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

exports.validatePostContent = [
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
  check("description", "description must be between 1 and 512 characters")
    .optional()
    .trim()
    .isLength({ min: 1, max: 512 }),
  check("title", "title must be between 1 and 255 characters")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check("content_url", "content_url must be between 1 and 255 characters")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check("public_id", "public_id must be between 1 and 255 characters")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check("img_public_id", "img_public_id must be between 1 and 255 characters")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check("img_url", "img_url must be between 1 and 255 characters")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
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
  check("description", "description must be between 1 and 512 characters")
    .optional()
    .trim()
    .isLength({ min: 1, max: 512 }),
  check("title", "title must be between 1 and 255 characters")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check("content_url", "content_url must be between 1 and 255 characters")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check("public_id", "public_id must be between 1 and 255 characters")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check("img_public_id", "img_public_id must be between 1 and 255 characters")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  check("img_url", "img_url must be between 1 and 255 characters")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
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
  check("imgId").custom((value, { req, loc, path }) =>
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
