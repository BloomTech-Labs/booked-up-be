const db = require('../data/dbConfig.js');

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByDisplayName,
  findByEmail,
  findByAdmin,
  update
};

function find() {
  return db('users');
}

function findBy(filter) {
  return db('users').where(filter);
}

function findByDisplayName(search) {
  return db('users')
    .where('display_name', search)
}

function findByEmail(search) {
  return db('users')
    .where('email', search)
}


function findByAdmin(search) {
  return db('users')
    .where('user_type', 'admin')
    .where('email', search)
}


function add(user) {
  return db('users')
      .insert(user, 'id')
      .then(ids => {
          return findById(ids[0]);
        });
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}

function update(id, changes) {
  return db('users')
    .where({ id })
    .update(changes)
    .then(() => {
      return findById(id);
    });
}
