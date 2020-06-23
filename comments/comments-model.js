const db = require("../data/dbConfig.js");

module.exports = {
  get,
  findByIdComment,
  findById,
  findContentAndCommentsById,
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

function findContentAndCommentsById(id) {
  return db("comments as c")
    .join("author_content as ac", "c.author_content_id", "ac.id")
    .join("genres as g", "c.author_content_id", "g.author_content_id")
    .join("users as u", "c.user_id", "u.id")
    .select(
      "ac.id as authorContentId",
      "ac.user_id as contentUserId",
      "ac.title",
      "ac.description",
      "ac.img_url",
      "ac.content_url",
      "ac.created_at",
      "ac.last_updated",
      "ac.public_id"
    )
    .select("g.*")
    .select(
      "c.id as commentId",
      "c.comment",
      "c.created_at as commentCreatedAt",
      "c.last_updated as commentLastUpdated",
      "c.user_id as commentUserId"
    )
    .select("u.first_name", "u.last_name")
    .where("c.author_content_id", id);
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
