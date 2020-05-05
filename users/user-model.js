const db = require('../data/dbConfig.js');

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByDisplayName,
  findByEmail
};

function find() {
  return db('users').select('id', 'first_name', 'last_name');
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
