const db = require("../data/dbConfig.js");

module.exports = {
  get,
  findByIdComment,
  findById,
  add,
  update,
  deleteComment,
};

function get() {
  return db("comments");
}

function findByIdComment(id) {
  return db("comments").where({ id });
}

function findById(id) {
  return db("comments").where("author_content_id", id);
}

function add(newComments) {
  return db("comments")
    .where("author_content_id")
    .insert(newComments)
    .returning("*");
}

function update(comment, id) {
  return db("comments")
    .where({
      id,
    })
    .update(comment)
    .then(() => findByIdComment(id));
}

function deleteComment(id) {
  return db("comments")
    .where({
      id,
    })
    .delete();
}
