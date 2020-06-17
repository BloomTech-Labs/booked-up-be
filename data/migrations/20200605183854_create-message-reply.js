exports.up = async (knex) => {
  return knex.schema

    .table("messages", (tbl) => {
      tbl.string("linking_id", 255);
    })
    .createTable("message_reply", (tbl) => {
      tbl.increments();
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
    })

    .createTable("genres", (tbl) => {
      tbl.increments();
      tbl.string("fantasy", 255);
      tbl.string("science_fiction", 255);
      tbl.string("horror", 255);
      tbl.string("western", 255);
      tbl.string("romance", 255);
      tbl.string("thriller", 255);
      tbl.string("mystery", 255);
      tbl.string("detective", 255);
      tbl.string("dystopia", 255);
      tbl.string("adventure", 255);
      tbl.string("memoir", 255);
      tbl.string("biography", 255);
      tbl.string("play", 255);
      tbl.string("musical", 255);
      tbl.string("theatre", 255);
      tbl
        .integer("author_content_id", 255)
        .unsigned()
        .notNullable()
        .references("author_content.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

exports.down = async (knex) => {
  return knex.schema
    .table("messages", (tbl) => {
      tbl.dropColumn("linking_id");
    })
    .dropTableIfExists("message_reply")
    .dropTableIfExists("genres");
};
