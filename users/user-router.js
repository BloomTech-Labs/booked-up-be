const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Agents = require("../agents/agent-model.js");
const Users = require("./user-model.js");

const checkRoleAdmin = require("../check-role/check-role-admin.js");
const restricted = require("../auth/restricted");

const {
  validateUserById,
  validateUpdateUser,
  validateUpdateEmail,
  validateUpdateDisplayName,
  validateUpdatePassword,
  validateDeleteUser,
  validateAegentInfoById,
  validateAgentInfo,
} = require("./user-validation");

const {
  getAllUsers,
  getUserById,
  updateUser,
  updateEmail,
  updateDisplayName,
  updatePassword,
  deleteUser,
  agentInfoById,
  postAgentInfo,
  updateAgentInfo,
} = require("./user-router-controller");

// GET all users

router.get("/", restricted, checkRoleAdmin(), getAllUsers);

// GET user by id

router.get("/:id", validateUserById, getUserById);

// UPDATE user

router.patch("/:id/", validateUpdateUser, updateUser);

// UPDATE email

router.patch("/:id/email", validateUpdateEmail, updateEmail);

// UPDATE display name

router.patch("/:id/displayName", validateUpdateDisplayName, updateDisplayName);

// UPDATE password

router.patch("/:id/updatePass", validateUpdatePassword, updatePassword);

// DELETE user

router.delete("/:id/", validateDeleteUser, deleteUser);

// GET Agent Info by Id

router.get("/:id/agent", validateAegentInfoById, agentInfoById);

// POST Agent Info

router.post("/:id/agent", validateAgentInfo, postAgentInfo);

// UPDATE Agent Info

router.patch("/:id/agent", validateAgentInfo, updateAgentInfo);

module.exports = router;
