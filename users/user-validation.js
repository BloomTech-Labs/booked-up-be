const { check, validationResult, body } = require("express-validator");
const Agents = require("../agents/agent-model.js");
const Users = require("./user-model.js");
const checkRole = require("../check-role/check-role-user.js");
const checkRoleAgent = require("../check-role/check-role-agent.js");
const restricted = require("../auth/restricted");
const bcrypt = require("bcryptjs");

// GET user by id

exports.validateUserById = [
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
  checkRole(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

// UPDATE user

exports.validateUpdateUser = [
  check("first_name", "first name must contain only letters or dashes")
    .trim()
    .matches(/^[a-zA-Z-]+$/),
  check("last_name", "first name must contain only letters or dashes")
    .trim()
    .matches(/^[a-zA-Z-]+$/),
  check("city", "please enter a valid city name")
    .optional()
    .trim()
    .matches(/^[a-zA-Z-]+$/),
  check("state", "please enter a valid state name")
    .optional()
    .trim()
    .matches(/^[a-zA-Z-]+$/),
  check("country", "please enter a valid country name")
    .optional()
    .trim()
    .matches(/^[a-zA-Z-]+$/),
  check("avatar_url", "url for avatar image").optional(),
  restricted,
  checkRole(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

// UPDATE email

exports.validateUpdateEmail = [
  check("email", "Must be a valid email").isEmail(),
  body("email").custom((value, { req, loc, path }) =>
    Users.findByEmail(value).then((user) => {
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

// UPDATE display name

exports.validateUpdateDisplayName = [
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
  body("display_name").custom((value, { req, loc, path }) =>
    Users.findByDisplayName(value).then((user) => {
      if (user.length === 0) {
        return null;
      }
      if (
        user[0].display_name === value &&
        Object.is(Number(req.params.id), user[0].id)
      ) {
        return Promise.reject("Please choose a new display name");
      }
      if (user.length > 0) {
        return Promise.reject("display name already registered");
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

// UPDATE password

exports.validateUpdatePassword = [
  check(
    "password",
    "Must contain 8 characters - one uppercase, one lowercase, one number, one special"
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  body("password").custom((value, { req, loc, path }) =>
    Users.findById(req.params.id).then((user) => {
      if (user === undefined) {
        throw new Error("User Id is not valid");
      } else if (bcrypt.compareSync(value, user.password)) {
        throw new Error("New password can not be previous password");
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

// DELETE user

exports.validateDeleteUser = [
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
  checkRole(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

// Get Agent Info by Id

exports.validateAegentInfoById = [
  check("id")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Agents.findByAgentInfoId(value).then((user) => {
        if (user === undefined) {
          return Promise.reject("Agent Info not found");
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

// POST Agent Info

exports.validateAgentInfo = [
  check("agent_type", "please enter a valid type of agent")
    .optional()
    .trim()
    .matches(/^[a-zA-Z- .,/]+$/),
  check("agency_name", "please enter a valid name of agency worked at")
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9@& ._-]+$/),
  check("agency_address", "please enter a valid agency address")
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9 .,_-]+$/),
  check("agency_phone_number", "please enter a valid agency phone number")
    .optional()
    .trim()
    .matches(
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
    ),
  check("agency_email", "please enter a valid agency email")
    .optional()
    .isEmail(),
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
  check("id")
    .exists()
    .toInt()
    .optional()
    .custom((value) =>
      Agents.findByAgentInfoId(value).then((user) => {
        if (user) {
          return Promise.reject("Agent info already created");
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

// User password reset request POST

exports.validateUserPasswordRequestReset = [
  check("email", "email field is required").not().isEmpty(),
  check("email", "a valid email is required").isEmail(),
  body("email").custom((value) =>
    Users.findByEmail(value).then((user) => {
      const newUser = user.map((u) => u.email_verification);
      if (user.length === 0) {
        return Promise.reject("email not registered");
      }
      if (newUser[0] === false) {
        return Promise.reject("email has not been validated");
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

// User password reset POST

exports.validateUserPasswordReset = [
  check("password", "Please enter a password").custom(
    (value, { req, loc, path }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("Passwords do not match");
      } else {
        return value;
      }
    }
  ),
  check(
    "password",
    "Must contain 8 characters - one uppercase, one lowercase, one number, one special"
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  body("password").custom((value, { req, loc, path }) =>
    Users.findById(Number(req.body.id)).then((user) => {
      if (user === undefined) {
        throw new Error("User Id is not valid");
      } else if (bcrypt.compareSync(req.body.password, user.password)) {
        throw new Error("New password can not be previous password");
      }
    })
  ),
  (req, res, next) => {
    const errors = validationResult(req);
    const errArr = errors.array();
    const errMsg = errArr.map((err) => `  ${err.msg}`);
    if (!errors.isEmpty()) {
      req.flash("error", errMsg);
      return res.redirect("back");
    }
    next();
  },
];
