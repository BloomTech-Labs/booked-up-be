exports.up = async (knex) => {
  return knex.schema.table("comments", (tbl) => {
    tbl
      .integer("author_content_id", 255)
      .unsigned()
      .notNullable()
      .references("author_content.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE")
      .alter();
  });
};

exports.down = async (knex) => {
  return knex.schema.dropTableIfExists("comments");
};
