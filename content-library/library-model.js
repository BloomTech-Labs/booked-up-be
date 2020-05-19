const db = require("../data/dbConfig.js");

module.exports = {
  get,
  getLibrary,
  findById,
  findByIdLibrary,
  add,
  update,
  deleteFavorite,
};

function get() {
  return db("content_library");
}

function getLibrary() {
  return db("content_library as cl")
    .join("author_content as ac", "cl.author_content_id", "ac.id")
    .select(
      "cl.id",
      "cl.author_content_id",
      "ac.title",
      "ac.content_url",
      "ac.created_at",
      "ac.last_updated",
      "ac.user_id"
    );
}

function findById(id) {
  return db("content_library").where("user_id", id);
}

function findByIdLibrary(id) {
  return db("content_library as cl")
    .join("author_content as ac", "cl.author_content_id", "ac.id")
    .select(
      "cl.id",
      "cl.author_content_id",
      "ac.title",
      "ac.content_url",
      "ac.created_at",
      "ac.last_updated",
      "ac.user_id"
    )
    .where("cl.user_id", id);
}

function add(newFavorite) {
  return db("content_library").insert(newFavorite).returning("*");
}

function update(favorite, id) {
  return db("content_library").where({ id }).update(favorite).returning("*");
}

function deleteFavorite(id) {
  return db("content_library").where({ id }).delete();
}
