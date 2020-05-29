const router = require("express").Router();
const db = require("./content-model");
const Users = require("../users/user-model");
const {
  check,
  validationResult,
  body
} = require("express-validator");
const restricted = require("../auth/restricted");

router.get("/", restricted, (req, res) => {
  db.get()
    .then((author_content) => {
      res.status(200).json(author_content);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Get by user ID

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
      newContent
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
    const content = req.body;
    const updatedContent = await db.update(content, id);
    res.status(201).json({
      updatedContent
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

router.delete("/:id", restricted, async (req, res) => {
  try {
    const workId = req.params.id;
    const deletedContent = await db.deleteContent(workId);
    if (deletedContent > 0) {
      res.status(204).send();
    } else {
      console.log(deletedContent);
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