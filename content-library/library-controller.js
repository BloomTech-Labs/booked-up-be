const db = require("./library-model");

exports.getAllLibraries = [
  (req, res) => {
    db.getLibrary()
      .then((content_library) => {
        res.status(200).json(content_library);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

exports.getLibraryById = [
  (req, res) => {
    db.findByIdLibrary(req.params.id)
      .then((library) => {
        const contentGenre = library.map((ele) => {
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
        res.status(200).json({ contentGenre });
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

exports.postLibrary = [
  async (req, res) => {
    try {
      const favorite = {
        user_id: req.params.id,
        author_content_id: req.body.author_content_id,
      };
      const [newFavorite] = await db.add(favorite);
      res.status(201).json({ newFavorite });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
];

exports.deleteLibrary = [
  async (req, res) => {
    try {
      const { contentId } = req.params;
      const { id } = req.params;
      const deletedContent = await db.deleteFavorite(id, contentId);
      if (deletedContent > 0) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Selection cannot be found." });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  },
];
