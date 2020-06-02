const router = require("express").Router();
const { check, validationResult, body } = require("express-validator");
const Messages = require("./message-model.js");
const MessageInbox = require("./message-inbox-model.js");
const Users = require("../users/user-model");
const checkRole = require("../check-role/check-role-message.js");
const restricted = require("../auth/restricted");

module.exports = router;
