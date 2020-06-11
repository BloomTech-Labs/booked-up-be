const db = require("../data/dbConfig.js");

function get() {
  return db("genres");
}

function findById(id) {
  return db("genres").where("user_id", id);
}

function add(newContent) {
  return db("genres").insert(newContent).returning("*");
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
  add,
  update,
  deleteGenre,
};
