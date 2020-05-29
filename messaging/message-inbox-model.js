const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByMessageId,
  removeMessage,
};

function find() {
  return db("message-inbox");
}

function findById(id) {
  return db("message-inbox as mi")
    .join("messages as m", "mi.message_id", "m.id")
    .join("users as u", "mi.user_id", "u.id")
    .select(
      "m.id",
      "u.email as sent by",
      "m.sender_id",
      "m.subject",
      "m.body",
      "m.created_at",
      "m.recipient_id",
      "m.recipient"
    )
    .where("m.sender_id", id)
    .orWhere("m.recipient_id", id);
}

function findByMessageId(id) {
  return db("message-inbox as mi")
    .join("messages as m", "mi.message_id", "m.id")
    .join("users as u", "mi.user_id", "u.id")
    .select(
      "m.id",
      "u.email as sent by",
      "m.sender_id",
      "m.subject",
      "m.body",
      "m.created_at",
      "m.recipient_id",
      "m.recipient"
    )
    .where("message_id", id)
    .first();
}

function findBy(filter) {
  return db("message-inbox").where(filter);
}

function add(message) {
  return db("message-inbox").insert(message);
  // .then((ids) => findById(ids[0]));
}

function removeMessage(id) {
  return db("message-inbox").where("id", id).del();
}
