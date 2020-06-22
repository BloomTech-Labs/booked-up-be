const Contents = require("./content-model");
const Genres = require("./genres-model");
const Comments = require("../comments/comments-model");

const {
  deleteServer,
  deletePublic,
  deleteImage,
} = require("./content-delete-functions");

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
            img_public_id,
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
            img_public_id,
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
            img_public_id,
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
            img_public_id,
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

exports.getContentByIdComments = [
  (req, res) => {
    Comments.findContentAndCommentsById(req.params.id)
      .then((content) => {
        const contentGenre = content.map((ele) => {
          const genres = [];
          const objectArray = Object.entries(ele);
          objectArray.map(([key, value]) => {
            if (value === true) {
              return genres.push(key);
            }
          });
          const commentsList = content.map((ele) => {
            return {
              commentId: ele.commentId,
              userId: ele.commentUserId,
              comment: ele.comment,
              createdAt: ele.commentCreatedAt,
              lastUpdated: ele.commentLastUpdated,
            };
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
            img_public_id,
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
            img_public_id,
            genres,
            commentsList,
          };
          return newObj;
        });
        res.status(200).json(contentGenre[0]);
      })
      .catch((err) => {
        res.status(500).json(err.message);
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
      img_url,
      img_public_id,
      fantasy,
      scienceFiction,
      horror,
      western,
      romance,
      mystery,
      biography,
      classic,
      comicsGraphicNovel,
      contemporary,
      crimeDetective,
      fable,
      fairyTale,
      folktale,
      historicalFiction,
      humor,
      legend,
      magicalRealism,
      metaFiction,
      mythology,
      mythopoeia,
      pictureBook,
      realisticFiction,
      shortStory,
      suspenseThriller,
      swashbuckler,
      tallTale,
      theologicalFiction,
    } = req.body;
    const newContent = {
      title,
      content_url,
      user_id: req.params.id,
      description,
      public_id,
      img_url,
      img_public_id,
    };
    Contents.add(newContent)
      .then((content) => {
        const newGenre = {
          user_id: req.params.id,
          author_content_id: content[0].id,
          fantasy,
          scienceFiction,
          horror,
          western,
          romance,
          mystery,
          biography,
          classic,
          comicsGraphicNovel,
          contemporary,
          crimeDetective,
          fable,
          fairyTale,
          folktale,
          historicalFiction,
          humor,
          legend,
          magicalRealism,
          metaFiction,
          mythology,
          mythopoeia,
          pictureBook,
          realisticFiction,
          shortStory,
          suspenseThriller,
          swashbuckler,
          tallTale,
          theologicalFiction,
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
      img_url,
      img_public_id,
      fantasy,
      scienceFiction,
      horror,
      western,
      romance,
      mystery,
      biography,
      classic,
      comicsGraphicNovel,
      contemporary,
      crimeDetective,
      fable,
      fairyTale,
      folktale,
      historicalFiction,
      humor,
      legend,
      magicalRealism,
      metaFiction,
      mythology,
      mythopoeia,
      pictureBook,
      realisticFiction,
      shortStory,
      suspenseThriller,
      swashbuckler,
      tallTale,
      theologicalFiction,
    } = req.body;
    const newContent = {
      title,
      content_url,
      user_id: req.params.id,
      description,
      public_id,
      img_url,
      img_public_id,
    };
    Contents.update(newContent, req.params.contentId)
      .then((content) => {
        const newGenre = {
          fantasy,
          scienceFiction,
          horror,
          western,
          romance,
          mystery,
          biography,
          classic,
          comicsGraphicNovel,
          contemporary,
          crimeDetective,
          fable,
          fairyTale,
          folktale,
          historicalFiction,
          humor,
          legend,
          magicalRealism,
          metaFiction,
          mythology,
          mythopoeia,
          pictureBook,
          realisticFiction,
          shortStory,
          suspenseThriller,
          swashbuckler,
          tallTale,
          theologicalFiction,
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
    const deleteServerPromise = deleteServer(req, res);
    const deletePublicPromise = deletePublic(req, res);
    const deleteImagePromise = deleteImage(req, res);

    return Promise.all([
      deleteServerPromise,
      deletePublicPromise,
      deleteImagePromise,
    ]).then((results) => res.status(200).json(results));
  },
];

exports.deleteServerPublicId = [
  async (req, res) => {
    const deleteServerPromise = deleteServer(req, res);
    const deletePublicPromise = deletePublic(req, res);

    return Promise.all([
      deleteServerPromise,
      deletePublicPromise,
    ]).then((results) => res.status(200).json(results));
  },
];

exports.deletePublicImage = [
  (req, res) => {
    const deletePublicImage = deleteImage(req, res);
    return Promise.resolve(deletePublicImage).then((results) =>
      res.status(200).json(results)
    );
  },
];
