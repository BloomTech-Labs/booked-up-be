const router = require("express").Router();
const cloudinary = require("cloudinary");

const restricted = require("../auth/restricted");

const {
  validateContent,
  validateUserId,
  validatePostContent,
  validateDeleteContent,
  validateUpdateContent,
  validateDeleteServerPublicId,
  validateDeleteImageId,
} = require("./content-validation");
const {
  postContent,
  getContentById,
  getContent,
  deleteContent,
  updateContent,
  getContentByIdComments,
  deleteServerPublicId,
  deletePublicImage,
} = require("./content-controller");

// Get all content

router.get("/", restricted, getContent);

// Get by user ID

router.get("/:id", validateUserId, getContentById);

// Get by content ID with comments

router.get("/:id/comments", validateContent, getContentByIdComments);

// Post content

router.post("/:id", validatePostContent, postContent);

// Update content

router.patch("/:id/:contentId", validateUpdateContent, updateContent);

// Delete public image

router.delete("/publicImage/:imgId/", validateDeleteImageId, deletePublicImage);

// Delete content

router.delete("/:id/:cloudId/:imgId", validateDeleteContent, deleteContent);

// Delete Id and public Id

router.delete(
  "/:id/:cloudId",
  validateDeleteServerPublicId,
  deleteServerPublicId
);

module.exports = router;
