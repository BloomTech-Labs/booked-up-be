const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByAgentInfoId,

  update,
};

function find() {
  return db("agent_info");
}

function findBy(filter) {
  return db("agent_info").where(filter);
}

function add(user) {
  return db("agent_info")
    .insert(user, "id")
    .then((ids) => findById(ids[0]));
}

function findById(id) {
  return db("agent_info").where({ id }).first();
}

function findByAgentInfoId(id) {
  return db("agent_info").where("user_id", id).first();
}

function update(id, changes, agentInfoId) {
  return db("agent_info")
    .where("user_id", id)
    .update(changes)
    .then(() => findById(agentInfoId));
}
