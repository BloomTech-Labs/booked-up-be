const db = require("../data/dbConfig.js");

function get() {
  return db("genres");
}

function findById(id) {
  return db("genres").where("user_id", id);
}

function add(newContent, id) {
  return db("genres as g")
    .insert(newContent)
    .join("author_content as ac", "g.author_content_id", "ac.id")
    .select(
      "ac.id",
      "ac.title",
      "ac. content_url",
      "ac.created_at",
      "ac.last_updated",
      "ac.user_id",
      "ac.description",
      "ac.img_url",
      "ac.public_id",
      "g.*"
    )
    .where("ac.id", id);
}

function findByIdGenre(id) {
  return db("genres as g")
    .join("author_content as ac", "g.author_content_id", "ac.id")
    .select(
      // "ac.id",
      // "ac.title",
      // "ac. content_url",
      // "ac.created_at",
      // "ac.last_updated",
      // "ac.user_id",
      // "ac.description",
      // "ac.img_url",
      // "ac.public_id",
      "g.*"
    )
    .where("ac.id", id);
}

function add(newContent, id) {
  return db("genres as g").insert(newContent).returning("*");
}

function update(content, id) {
  return db("genres").where({ id }).update(content).returning("*");
}

function deleteGenre(id) {
  return db("genres").where({ id }).delete();
}

module.exports = {
  get,
  findById,
  findByIdGenre,
  add,
  update,
  deleteGenre,
};
