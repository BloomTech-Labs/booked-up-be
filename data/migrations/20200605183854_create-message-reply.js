exports.up = async (knex) => {
  return knex.schema.createTable("message_reply", (tbl) => {
    tbl.increments();
    tbl.string("linking_id", 255);
    tbl
      .integer("message_id", 255)
      .unsigned()
      .notNullable()
      .references("messages.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    tbl
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    tbl
      .integer("recipient_id")
      .unsigned()
      .notNullable()
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = async (knex) => {
  return knex.schema.dropTableIfExists("message_reply");
};
