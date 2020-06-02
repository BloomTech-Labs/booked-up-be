exports.up = async (knex) => {
  return knex.schema
    .table("messages", (tbl) => {
      tbl.string("recipient", 255);
    })
    .table("message-inbox", (tbl) => {
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
  knex.schema.table("messages", (tbl) => {
    tbl.dropTableIfExists("message-inbox");
    tbl.dropTableIfExists("messages");
  });
};
