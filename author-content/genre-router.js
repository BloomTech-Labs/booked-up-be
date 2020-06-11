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
      const content = req.body;
      const [newContent] = await db.add(content);
      res.status(201).json({
        newContent,
      });
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  });
  