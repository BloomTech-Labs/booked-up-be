const router = require("express").Router();
const cloudinary = require("cloudinary");
const { check, validationResult, body } = require("express-validator");
const db = require("./content-model");
const Users = require("../users/user-model");
const restricted = require("../auth/restricted");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

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
      newContent,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

router.put("/:id", restricted, async (req, res) => {
  try {
    const { id } = req.params;
    const content = req.body;
    const updatedContent = await db.update(content, id);
    res.status(201).json({
      updatedContent,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

router.delete(
  "/:id/:cloudId",
  [
    check("id")
      .exists()
      .toInt()
      .optional()
      .custom((value) =>
        db.findByIdContent(value).then((user) => {
          if (user.length === 0) {
            return Promise.reject("Content not found on server");
          }
        })
      ),
    check("cloudId").custom(
      (value, { req, loc, path }) =>
        new Promise((resolve, reject) => {
          cloudinary.v2.api.resource(value, (error, success) => {
            try {
              if (error) {
                reject(error);
              }
            } catch (err) {
              reject(err);
            }
          });
        })
    ),
  ],
  restricted,
  async (req, res) => {
    const { id, cloudId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }

    async function func1() {
      const promise = new Promise((resolve, reject) => {
        db.deleteContent(id)
          .then(() => {
            resolve({ server: "content removed from server" });
          })
          .catch((err) => {
            reject(err);
          });
      });
      return promise;
    }

    async function func2() {
      return cloudinary.v2.uploader.destroy(`${cloudId}`, (error, success) => {
        const promise = new Promise((resolve, reject) => {
          try {
            if (success) {
              resolve(success);
            }
          } catch (err) {
            reject(error);
          }
        });
        return promise;
      });
    }

    const promise1 = func1();
    const promise2 = func2();

    return Promise.all([promise1, promise2]).then((results) =>
      res.status(200).json(results)
    );
  }
);

module.exports = router;
