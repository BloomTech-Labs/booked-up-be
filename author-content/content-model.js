const db = require("../data/dbConfig.js");

module.exports = {
  get,
  add,
  update,
  deleteContent,
};

function get() {
  return db("author_content");
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
