const db = require("../data/dbConfig.js");

function add(message) {
  return db("message_reply").insert(message);
  // .then((ids) => findById(ids[0]));
}

function findById(id, query) {
  const sortByCreatedAt = query.sort;
  const limitNum = parseInt(`${parseInt(query.limit)}`);
  return db("message_reply as mr")
    .join("messages as m", "mr.message_id", "m.id")
    .join("users as u", "mr.user_id", "u.id")
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
    .where("mr.linking_id", id)
    .andWhere((qb) => {
      if (query.body) {
        qb.where("m.body", "like", `%${query.body}%`);
      }
      if (query.body) {
        qb.orWhere("m.subject", "like", `%${query.body}%`);
      }
      if (query.body) {
        qb.orWhere("u.email", "like", `%${query.body}%`);
      }
      if (query.body) {
        qb.orWhere("m.recipient", "like", `%${query.body}%`);
      }
    })
    .limit(limitNum)
    .orderBy("m.created_at", `${sortByCreatedAt}`);
}

module.exports = {
  add,
  findById,
};
