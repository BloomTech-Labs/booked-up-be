const router = require("express").Router();
const restricted = require("../auth/restricted");

const {
  validateUserId,
  validatePost,
  validateDelete,
} = require("./library-validation");

const {
  getLibraryById,
  getAllLibraries,
  postLibrary,
  deleteLibrary,
} = require("./library-controller");

// Get all libraries

router.get("/", restricted, getAllLibraries);

// Get by user Id

router.get("/:id", validateUserId, getLibraryById);

// Post library

router.post("/:id", validatePost, postLibrary);

// Delete Library

router.delete("/:id/:contentId", validateDelete, deleteLibrary);

module.exports = router;
