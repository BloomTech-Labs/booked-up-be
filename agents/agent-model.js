const db = require('../data/dbConfig.js');

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByAgentInfoId,

  update
};

function find() {
  return db('agent_info');
}

function findBy(filter) {
  return db('agent_info').where(filter);
}

function add(user) {
  return db('agent_info')
      .insert(user, 'id')
      .then(ids => {
          return findById(ids[0]);
        });
}

function findById(id) {
  return db('agent_info')
    .where({ id })
    .first();
}

function findByAgentInfoId(id) {
  return db('agent_info')
    .where('user_id', id)
    .first();
}

function update(id, changes) {
  return db('agent_info')
    .where({ id })
    .update(changes)
    .then(() => {
      return findById(id);
    });
}