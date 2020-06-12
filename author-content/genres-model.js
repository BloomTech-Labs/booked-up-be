const db = require("../data/dbConfig.js");

function get() {
  return db("genres");
}

function findById(id) {
  return db("genres as g")
    .join("author_content as ac", "g.author_content_id", "ac.id")
    .where("ac.user_id", id);
}

function findByIdGenre(id) {
  return db("genres as g")
    .join("author_content as ac", "g.author_content_id", "ac.id")
    .select("g.*")
    .where("ac.id", id);
}

function add(newContent) {
  return db("genres as g").insert(newContent);
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
