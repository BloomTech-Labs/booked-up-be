const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByIdSent,
  findByIdRecieved,
  findByIdSubject,
  findByIdRecievedSubject,
  findByIdSentSubject,
  findByMessageId,
  removeMessage,
};

function find() {
  return db("message-inbox");
}

// function findById(id, query) {
//   const knexQuery = db("message-inbox as mi");
//   const knexQueryFinal = knexQuery
//     .join("messages as m", "mi.message_id", "m.id")
//     .join("users as u", "mi.user_id", "u.id")
//     .select(
//       "m.id",
//       "u.email as sent by",
//       "m.sender_id",
//       "m.subject",
//       "m.body",
//       "m.created_at",
//       "m.recipient_id",
//       "m.recipient"
//     )
//     .where("m.sender_id", id);

//   if (query.body) {
//     knexQueryFinal
//       .where("m.body", "like", `%${query.body}%`)
//       .orWhere("m.subject", "like", `%${query.body}%`);
//   }
//   return knexQueryFinal;
// }

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

function findByIdSent(id, query) {
  const knexQuery0 = db("message-inbox as mi")
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
    .where({ "m.sender_id": id });
  const knexQuery1 = db("message-inbox as mi")
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
    .where({ "m.sender_id": id });
  const knexQuery = db("message-inbox as mi")
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
    .where({ "m.sender_id": id });

  if (query.body) {
    return knexQuery1.andWhere("m.body", "like", `%${query.body}%`);
  }

  if (query.subject) {
    return knexQuery1.andWhere("m.subject", "like", `%${query.subject}%`);
  }
  return knexQuery;
}

function findByIdRecieved(id) {
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
    .where("m.recipient_id", id);
}

function findByIdSubject(id) {
  return db("message-inbox as mi")
    .join("messages as m", "mi.message_id", "m.id")
    .join("users as u", "mi.user_id", "u.id")
    .select("m.id", "u.email as sent by", "m.subject")
    .where("m.sender_id", id)
    .orWhere("m.recipient_id", id);
}

function findByIdRecievedSubject(id) {
  return db("message-inbox as mi")
    .join("messages as m", "mi.message_id", "m.id")
    .join("users as u", "mi.user_id", "u.id")
    .select("m.id", "m.subject")
    .where("m.recipient_id", id);
}

function findByIdSentSubject(id) {
  return db("message-inbox as mi")
    .join("messages as m", "mi.message_id", "m.id")
    .join("users as u", "mi.user_id", "u.id")
    .select("m.id", "m.subject")
    .where("m.sender_id", id);
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
  return db("message-inbox as mi").where("mi.message_id", id).del();
}
