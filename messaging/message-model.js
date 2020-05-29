const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByUserId,
  removeMessage,
};

function find() {
  return db("messages");
}

function findById(id) {
  return db("messages as m")
    .select(
      "m.id",
      "m.sender_id",
      "m.subject",
      "m.body",
      "m.recipient",
      "m.recipient_id",
      "m.created_at"
    )
    .where({ id })
    .first();
}

function findByUserId(id) {
  return db("messages").where({ id }).first();
}

function findBy(filter) {
  return db("messages").where(filter);
}

function add(message) {
  return db("messages")
    .insert(message, "id")
    .then((ids) => findById(ids[0]));
}

function removeMessage(id) {
  return db("messages").where("id", id).del();
}
