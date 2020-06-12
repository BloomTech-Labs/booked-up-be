const router = require("express").Router();
const db = require("./content-model");

const restricted = require("../auth/restricted");

const {
  validateUserId,
  validateDeleteContent,
  validateUpdateContent,
} = require("./content-validation");
const {
  postContent,
  getContentById,
  getContent,
  deleteContent,
  updateContent,
} = require("./content-controller");

// Get all content

router.get("/", restricted, getContent);

// Get by user ID

router.get("/:id", validateUserId, getContentById);

// Post content

router.post("/:id", validateUserId, postContent);

// Update content

router.patch("/:id/:contentId", validateUpdateContent, updateContent);

// Deete content

router.delete("/:id/:cloudId", validateDeleteContent, deleteContent);

module.exports = router;
