const router = require("express").Router();
const cloudinary = require("cloudinary");
const { check, validationResult, body } = require("express-validator");
const db = require("./content-model");
const Users = require("../users/user-model");
const Genres = require("./genres-model");
const restricted = require("../auth/restricted");

const { validateUserId } = require("./content-validation");
const {
  postMessage,
  getContentById,
  getContent,
} = require("./content-controller");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Get all content

router.get("/", restricted, getContent);

// Get by user ID

router.get("/:id", validateUserId, getContentById);

// Post content

router.post("/:id", validateUserId, postMessage);

// Update content

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

// Deete content

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
