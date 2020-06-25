const { check, validationResult, body } = require("express-validator");
const MessageInbox = require("./message-inbox-model.js");
const Users = require("../users/user-model");
const checkRole = require("../check-role/check-role-message.js");
const checkRoleAgent = require("../check-role/check-role-agent");
const restricted = require("../auth/restricted");

exports.validateMessageSend = [
  body("recipient").custom((value, { req, loc, path }) => {
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
        return Promise.reject("recipient field required");
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
  check("subject", "subject must not exceed 255 characters")
    .optional()
    .isLength({ max: 255 }),
  check("body", "please enter a body not exceeding 1020 characters").isLength({
    max: 1020,
  }),
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
  check("recipient_id")
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
  checkRoleAgent(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateMessageReply = [
  body("recipient").custom((value, { req, loc, path }) => {
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
        return Promise.reject("recipient field required");
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
  check("subject", "subject must not exceed 255 characters")
    .optional()
    .isLength({ max: 255 }),
  check("body", "please enter a body not exceeding 1020 characters").isLength({
    max: 1020,
  }),
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
  check("replyId")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      MessageInbox.findByMessageId(value).then((user) => {
        if (user === undefined) {
          return Promise.reject("Message not found");
        }
      })
    ),
  check("recipient_id")
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

exports.validateMessageByMessageId = [
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
  check("messageId")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      MessageInbox.findByMessageId(value).then((user) => {
        if (user === undefined) {
          return Promise.reject("Message not found");
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

exports.validateMessageInboxId = [
  check("id")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      MessageInbox.findByMessageId(value).then((user) => {
        if (user === undefined) {
          return Promise.reject("Message not found");
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

exports.sentIdRecievedId = [
  check("sentId")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Users.findById(value).then((user) => {
        if (user === undefined) {
          return Promise.reject("Sending User not found");
        }
      })
    ),
  check("recievedId")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Users.findById(value).then((user) => {
        if (user === undefined) {
          return Promise.reject("Recipient User not found");
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
