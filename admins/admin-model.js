const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByEmail,
  findByAdmin,
  update,
};

function find() {
  return db("admins").select("id", "username", "password");
}

function findBy(filter) {
  return db("admins").where(filter);
}

function findByEmail(search) {
  return db("admins").where("email", search);
}

function findByAdmin(search) {
  return db("admins").where("user_type", "admin").where("email", search);
}

function add(user) {
  return db("admins")
    .insert(user, "id")
    .then((ids) => {
      return findById(ids[0]);
    });
}

function findById(id) {
  return db("admins").where({ id }).first();
}

function update(id, changes) {
  return db("admins")
    .where({ id })
    .update(changes)
    .then(() => {
      return findById(id);
    });
}
