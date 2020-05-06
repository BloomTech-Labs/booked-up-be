const db = require('../data/dbConfig.js');

module.exports = {
  add,
  find,
  findBy,
  findById,
  update
};

function find() {
  return db('agent_info');
}

function findBy(filter) {
  return db('agent_info').where(filter);
}




function add(user) {
  return db('admins')
      .insert(user, 'id')
      .then(ids => {
          return findById(ids[0]);
        });
}

function findById(id) {
  return db('admins')
    .where({ id })
    .first();
}

function update(id, changes) {
  return db('admins')
    .where({ id })
    .update(changes)
    .then(() => {
      return findById(id);
    });
}