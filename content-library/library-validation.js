const Users = require("../users/user-model");
const Contents = require("../author-content/content-model");
const Library = require("./library-model");
const restricted = require("../auth/restricted");
const { check, validationResult, body } = require("express-validator");

exports.validateUserId = [
  check("id")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Users.findById(value).then((user) => {
        if (user === undefined) {
          return Promise.reject("User Id not found");
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

exports.validatePost = [
  check("id")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Users.findById(value).then((user) => {
        if (user === undefined) {
          return Promise.reject("User Id not found");
        }
      })
    ),
  check("author_content_id")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Contents.findByIdContent(value).then((user) => {
        if (user.length === 0) {
          return Promise.reject("Content not found on server");
        }
      })
    )
    .custom((value, { req, loc, path }) =>
      Library.findByUserIdContentId(req.params.id, value).then((library) => {
        if (library.length > 0) {
          return Promise.reject("Content already saved");
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

exports.validateDelete = [
  check("id")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Users.findById(value).then((user) => {
        if (user === undefined) {
          return Promise.reject("User Id not found");
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
