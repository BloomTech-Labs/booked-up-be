const db = require("../data/dbConfig.js");

module.exports = {
  get,
  findById,
  findByIdContent,
  findByIdGenre,
  add,
  update,
  deleteContent,
};

function get() {
  return db("author_content");
}

function findById(id) {
  return db("author_content").where("user_id", id);
}

function findByIdGenre(id) {
  return db("author_content as ac")
    .join("genres as g", "g.author_content_id", "ac.id")
    .select("ac.*", "g.*")
    .where("g.user_id", id);
}

function findByIdContent(id) {
  return db("author_content").where({ id });
}

function add(newContent) {
  return db("author_content").insert(newContent).returning("*");
}

function update(content, id) {
  return db("author_content").where({ id }).update(content).returning("*");
}

function deleteContent(id) {
  return db("author_content").where({ id }).delete();
}
