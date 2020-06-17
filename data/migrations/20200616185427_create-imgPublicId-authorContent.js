exports.up = async (knex) => {
  return knex.schema.createTable("author_content", (tbl) => {
    tbl.increments();
    tbl.string("title", 255);
    tbl.string("description", 255);
    tbl.string("img_url");
    tbl.string("content_url", 255);
    tbl.string("public_id", 255);
    tbl.string("img_public_id", 255);
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
    tbl.timestamp("last_updated").defaultTo(knex.fn.now());
    tbl
      .integer("user_id", 255)
      .unsigned()
      .notNullable()
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = async (knex) => {
  return knex.schema.dropTableIfExists("author_content");
};
