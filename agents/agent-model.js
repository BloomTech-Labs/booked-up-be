const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByAgentInfoId,
  update,
  remove,
};

function find() {
  return db("agent_info");
}

function findBy(filter) {
  return db("agent_info").where(filter);
}

function findById(id) {
  return db("agent_info").where({ id }).first();
}

function findByAgentInfoId(id) {
  return db("agent_info").where("user_id", id).first();
}

function add(user) {
  return db("agent_info")
    .insert(user, "id")
    .then((ids) => findById(ids[0]));
}

function update(id, changes, agentInfoId) {
  return db("agent_info")
    .where("user_id", id)
    .update(changes)
    .then(() => findById(agentInfoId));
}

function remove(id) {
  return db("agent_info").where({ id }).del();
}
