const router = require("express").Router();
const restricted = require("../auth/restricted");

const {
  validateAuthorContent,
  validatePostComment,
  validateUpdateComment,
  validateDeleteComment,
} = require("./comments-validation");

const {
  getAllComments,
  CommentsByAuthorContentId,
  PostComment,
  updateComment,
  deleteComment,
} = require("./comments-controller");

// Get all comments

router.get("/", restricted, getAllComments);

// Get comments by author_content_id

router.get("/:id", validateAuthorContent, CommentsByAuthorContentId);

// Get comment by CommentId ***

// Get all comments by UserId ***

// Post comment by UserId on ContentId

router.post("/:id/:contentId", validatePostComment, PostComment);

// Update comment by UserId on CommentId

router.patch("/:id/:commentId", validateUpdateComment, updateComment);

// Delete Comment

router.delete("/:id", validateDeleteComment, deleteComment);

module.exports = router;
