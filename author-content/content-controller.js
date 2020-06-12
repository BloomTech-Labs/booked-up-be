const cloudinary = require("cloudinary");
const Contents = require("./content-model");
const Genres = require("./genres-model");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

exports.getContent = [
  (req, res) => {
    Genres.get()
      .then((finalContent) => {
        const contentGenre = finalContent.map((ele) => {
          const genres = [];
          const objectArray = Object.entries(ele);
          objectArray.map(([key, value]) => {
            if (value === true) {
              return genres.push(key);
            }
          });
          const {
            id,
            user_id,
            title,
            description,
            img_url,
            content_url,
            created_at,
            last_updated,
            public_id,
          } = ele;
          const newObj = {
            id,
            user_id,
            title,
            description,
            img_url,
            content_url,
            created_at,
            last_updated,
            public_id,
            genres,
          };
          return newObj;
        });
        res.status(200).json(contentGenre);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

exports.getContentById = [
  (req, res) => {
    Genres.findById(req.params.id)
      .then((finalContent) => {
        const contentGenre = finalContent.map((ele) => {
          const genres = [];
          const objectArray = Object.entries(ele);
          objectArray.map(([key, value]) => {
            if (value === true) {
              return genres.push(key);
            }
          });
          const {
            id,
            user_id,
            title,
            description,
            img_url,
            content_url,
            created_at,
            last_updated,
            public_id,
          } = ele;
          const newObj = {
            id,
            user_id,
            title,
            description,
            img_url,
            content_url,
            created_at,
            last_updated,
            public_id,
            genres,
          };
          return newObj;
        });
        res.status(200).json(contentGenre);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

exports.postContent = [
  (req, res) => {
    const {
      title,
      content_url,
      description,
      public_id,
      fantasy,
      science_fiction,
      horror,
      western,
      romance,
      thriller,
      mystery,
      detective,
      dystopia,
      adventure,
      memoir,
      biography,
      play,
      musical,
      theatre,
    } = req.body;
    const newContent = {
      title,
      content_url,
      user_id: req.params.id,
      description,
      public_id,
    };
    Contents.add(newContent)
      .then((content) => {
        const newGenre = {
          user_id: req.params.id,
          author_content_id: content[0].id,
          fantasy,
          science_fiction,
          horror,
          western,
          romance,
          thriller,
          mystery,
          detective,
          dystopia,
          adventure,
          memoir,
          biography,
          play,
          musical,
          theatre,
        };
        Genres.add(newGenre)
          .then(() => {
            Genres.findByIdGenre(content[0].id)
              .then((finalGenre) => {
                const genre = [];
                finalGenre.map((g) => {
                  const objectArray = Object.entries(g);
                  objectArray.map(([key, value]) => {
                    if (value === true) {
                      return genre.push(key);
                    }
                  });
                });
                res.status(200).json({ content, Genres: genre });
              })
              .catch((err) => {
                res.status(400).json(err.message);
              });
          })
          .catch((err) => {
            res.status(400).json(err.message);
          });
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

exports.updateContent = [
  (req, res) => {
    const {
      title,
      content_url,
      description,
      public_id,
      fantasy,
      science_fiction,
      horror,
      western,
      romance,
      thriller,
      mystery,
      detective,
      dystopia,
      adventure,
      memoir,
      biography,
      play,
      musical,
      theatre,
    } = req.body;
    const newContent = {
      title,
      content_url,
      user_id: req.params.id,
      description,
      public_id,
    };
    Contents.update(newContent, req.params.contentId)
      .then((content) => {
        const newGenre = {
          fantasy,
          science_fiction,
          horror,
          western,
          romance,
          thriller,
          mystery,
          detective,
          dystopia,
          adventure,
          memoir,
          biography,
          play,
          musical,
          theatre,
        };
        Genres.update(newGenre, req.params.contentId)
          .then(() => {
            Genres.findByIdGenre(content[0].id)
              .then((finalGenre) => {
                const genre = [];
                finalGenre.map((g) => {
                  const objectArray = Object.entries(g);
                  objectArray.map(([key, value]) => {
                    if (value === true) {
                      return genre.push(key);
                    }
                  });
                });
                res.status(200).json({ content, Genres: genre });
              })
              .catch((err) => {
                res.status(400).json(err.message);
              });
          })
          .catch((err) => {
            res.status(400).json(err.message);
          });
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

exports.deleteContent = [
  async (req, res) => {
    const { id, cloudId } = req.params;

    async function func1() {
      const promise = new Promise((resolve, reject) => {
        Contents.deleteContent(id)
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

    return Promise.all([promise2, promise1]).then((results) =>
      res.status(200).json(results)
    );
  },
];
