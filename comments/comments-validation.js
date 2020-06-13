const Comments = require("./comments-model");
const Content = require("../author-content/content-model");
const Users = require("../users/user-model");
const { check, validationResult, body } = require("express-validator");
const restricted = require("../auth/restricted");

exports.validateAuthorContent = [
  check("id")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Comments.findById(value).then((authId) => {
        if (authId === undefined) {
          return Promise.reject("Author Content Id not found");
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

exports.validatePostComment = [
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
      Content.findByIdContent(value).then((authId) => {
        if (authId.length === 0) {
          return Promise.reject("Author Content not found");
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

exports.validateUpdateComment = [
  check("comment", "Please include a comment").not().isEmpty(),
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
  check("commentId")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Comments.findByIdComment(value).then((authId) => {
        if (authId.length === 0) {
          return Promise.reject("Comment not found");
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

// Delete Comment

exports.validateDeleteComment = [
  check("id")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Comments.findByIdComment(value).then((authId) => {
        if (authId.length === 0) {
          return Promise.reject("Comment not found");
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
