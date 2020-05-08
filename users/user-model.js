const db = require('../data/dbConfig.js');

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByDisplayName,
  findByEmail,
  findByAdmin,
  update,
  removeUser,

  // Agent Info

  findAgentInfoId
};

function find() {
  return db('users');
}

function findAgentInfoId(id) {
  return db('agent_info as ai')
    .join('users as u', 'u.id', 'ai.user_id')
    .where('ai.user_id', id)
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
    .where('id', id)
    .first();
}

// function findByIdNew(id) {
//   return db('users')
//     .where({ id })
//     .first();
// }

function update(id, changes) {
  return db('users')
    .where({ id })
    .update(changes)
    .then(() => {
      return findById(id);
    });
}


function removeUser(id) {
  return db('users')
    .where('id', id)
    .del();
}
