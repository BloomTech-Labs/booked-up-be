const db = require("../data/dbConfig.js");

module.exports = {
    get,
    add,
    update,
    deleteComment,
};

function get() {
    return db("comments");
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