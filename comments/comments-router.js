const router = require("express").Router();
const db = require("./comments-model");
// const Users = require("../comments/comments-model");
const {
    check,
    validationResult,
    body
} = require("express-validator");
const restricted = require("../auth/restricted");

router.get("/", restricted, (req, res) => {
    db.get()
        .then((comments) => {
            res.status(200).json(comments);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.post("/", restricted, async (req, res) => {
    try {
        const comment = req.body;
        const [newComments] = await db.add(comment);
        res.status(201).json({
            newComments
        });
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});

router.put("/:id", restricted, async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const comment = req.body;
        const updatedComment = await db.update(comment, id);
        res.status(201).json({
            updatedComment
        });
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});

router.delete("/:id", restricted, async (req, res) => {
    try {
        const commentId = req.params.id;
        const deletedComment = await db.deleteComment(commentId);
        if (deletedContent > 0) {
            res.status(204).send();
        } else {
            console.log(deletedComment);
            res.status(404).json({
                message: "Selection cannot be found."
            });
        }
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});

module.exports = router;