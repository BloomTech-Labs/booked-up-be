const db = require('../data/dbConfig.js');

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByDisplayName,
  findByEmail,
  findByEmailContentLibrary,
  findByIdContentLibrary,
  findByIdAuthorContent,
  findByAdmin,
  update,
  removeUser,

  // Agent Info

  findAgentInfoId
};

function find() {
  return db('users');
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
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

function findByEmailContentLibrary(search) {
  return db('users as u')
    .join('content_library as cl', 'u_id', 'u.id')
    .where('email', search)
}

function findByIdContentLibrary(id) {
  return db('content_library as cl')
    .join('users as u', 'u.id', 'cl.user_id')
    .select('cl.*')
    .where('cl.user_id', id)

}

function findByIdAuthorContent(id) {
  return db('author_content as ac')
    .join('users as u', 'u.id', 'ac.user_id')
    .select('ac.*')
    .where('ac.user_id', id)
}

function findByAdmin(search) {
  return db('users')
    .where('user_type', 'admin')
    .where('email', search)
}

function findAgentInfoId(id) {
  return db('agent_info as ai')
    .join('users as u', 'u.id', 'ai.user_id')
    .where('ai.user_id', id)
}

function add(user) {
  return db('users')
      .insert(user, 'id')
      .then(ids => {
          return findById(ids[0]);
        });
}

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