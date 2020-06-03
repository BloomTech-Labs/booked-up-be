const router = require("express").Router();
const db = require("./comments-model");
const Users = require("../users/user-model");
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

router.get(
    "/:id",
    [
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
    ],
    restricted,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        }
        db.findById(req.params.id)
            .then((comment) => {
                res.status(200).json(comment);
            })
            .catch((err) => {
                res.status(500).json(err.message);
            });
    }
);

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
        if (deletedComment > 0) {
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