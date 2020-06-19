const db = require("../data/dbConfig.js");

module.exports = {
  get,
  getLibrary,
  findById,
  findByUserIdContentId,
  findByIdLibrary,
  add,
  deleteFavorite,
};

function get() {
  return db("content_library");
}

function getLibrary() {
  return db("content_library as cl")
    .join("author_content as ac", "cl.author_content_id", "ac.id")
    .select(
      "cl.user_id",
      "cl.author_content_id",
      "ac.title",
      "ac.description",
      "ac.img_url",
      "ac.content_url",
      "ac.created_at",
      "ac.last_updated",
      "ac.user_id"
    );
}

function findById(id) {
  return db("content_library").where("user_id", id);
}

function findByUserIdContentId(id, contentId) {
  return db("content_library")
    .where("user_id", id)
    .andWhere("author_content_id", contentId);
}

function findByIdLibrary(id) {
  return db("content_library as cl")
    .join("author_content as ac", "cl.author_content_id", "ac.id")
    .join("genres as g", "cl.author_content_id", "g.author_content_id")
    .where("cl.user_id", id);
}

function add(newFavorite) {
  return db("content_library").insert(newFavorite).returning("*");
}

function deleteFavorite(id, contentId) {
  return db("content_library")
    .where("user_id", id)
    .andWhere("author_content_id", contentId)
    .delete();
}
