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
    .table("author_content", (tbl) => {
      tbl.dropColumn("img_public_id");
    })
    .table("comments", (tbl) => {
      tbl.dropColumn("author_content_id");
    });
};
