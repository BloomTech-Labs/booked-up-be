const cloudinary = require("cloudinary");
const Contents = require("./content-model");
const Genres = require("./genres-model");

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

exports.postMessage = [
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
