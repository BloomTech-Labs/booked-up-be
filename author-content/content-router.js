const router = require("express").Router();
const cloudinary = require("cloudinary");

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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

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
