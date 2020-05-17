const db = require("../data/dbConfig.js");

module.exports = {
  get,
  add,
  update,
  deleteFavorite,
};

function get() {
  return db("content_library");
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
