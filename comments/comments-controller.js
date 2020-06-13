const Comments = require("./comments-model");

exports.getAllComments = [
  (req, res) => {
    Comments.get()
      .then((comments) => {
        res.status(200).json(comments);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

exports.CommentsByAuthorContentId = [
  (req, res) => {
    Comments.findById(req.params.id)
      .then((comment) => {
        res.status(200).json(comment);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

exports.PostComment = [
  (req, res) => {
    const newComment = {
      comment: req.body.comment,
      user_id: req.params.id,
      author_content_id: req.params.contentId,
    };
    Comments.add(newComment)
      .then((comment) => {
        res.status(201).json({
          comment,
        });
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

exports.updateComment = [
  (req, res) => {
    const updateComment = {
      comment: req.body.comment,
    };
    Comments.update(updateComment, req.params.commentId)
      .then((comment) => {
        res.status(201).json(comment);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

exports.deleteComment = [
  async (req, res) => {
    try {
      const commentId = req.params.id;
      const deletedComment = await Comments.deleteComment(commentId);
      res.status(204).json(deletedComment);
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  },
];
