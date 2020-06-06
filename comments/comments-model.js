const db = require("../data/dbConfig.js");

module.exports = {
    get,
    findById,
    add,
    update,
    deleteComment,
};

function get() {
    return db("comments");
}

function findById(id) {
    return db("comments").where("user_id", id);
}

function add(newComments) {
    return db("comments").insert(newComments).returning("*");
}

function update(comment, id) {
    return db("comments").where({
        id
    }).update(comment).returning("*");
}

function deleteComment(id) {
    return db("comments").where({
        id
    }).delete();
}