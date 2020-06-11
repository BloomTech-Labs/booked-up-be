const router = require("express").Router();
const {
    check,
    validationResult,
    body
} = require("express-validator");
const db = require("./genre-model");
const Users = require("../users/user-model");
const restricted = require("../auth/restricted");

router.get("/", restricted, (req, res) => {
    db.get()
        .then((content) => {
            res.status(200).json(content);
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
            .then((content) => {
                res.status(200).json(content);
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    }
);

router.post("/", restricted, async (req, res) => {
    try {
        const genre = req.body;
        const [newGenre] = await db.add(genre);
        res.status(201).json({
            newGenre,
        });
    } catch (error) {
        res.status(500).json({
            error,
        });
    }
});

router.put("/:id", restricted, async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const genre = req.body;
        const updatedGenre = await db.update(genre, id);
        res.status(201).json({
            updatedGenre
        });
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});

router.delete("/:id", restricted, async (req, res) => {
    try {
        const genreId = req.params.id;
        const deletedGenre = await db.deleteGenre(genreId);
        if (deletedGenre > 0) {
            res.status(204).send();
        } else {
            console.log(deletedGenre);
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