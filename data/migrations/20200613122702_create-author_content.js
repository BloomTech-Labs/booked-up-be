exports.up = async (knex) => {
  return knex.schema

    .table("author_content", (tbl) => {
      tbl.string("img_public_id", 255);
    })

    .table("comments", (tbl) => {
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
  return knex.schema
    .dropTableIfExists("genres")
    .dropTableIfExists("content_library")
    .dropTableIfExists("comments")
    .dropTableIfExists("author_content");
};
