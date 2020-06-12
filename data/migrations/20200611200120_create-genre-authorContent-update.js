exports.up = async (knex) => {
  return knex.schema

    .table("author_content", (tbl) => {
      tbl.string("public_id", 255);
    })

    .table("genres", (tbl) => {
      tbl.boolean("fantasy").defaultTo(false).alter();
      tbl.boolean("science_fiction").defaultTo(false).alter();
      tbl.boolean("horror").defaultTo(false).alter();
      tbl.boolean("western").defaultTo(false).alter();
      tbl.boolean("romance").defaultTo(false).alter();
      tbl.boolean("thriller").defaultTo(false).alter();
      tbl.boolean("mystery").defaultTo(false).alter();
      tbl.boolean("detective").defaultTo(false).alter();
      tbl.boolean("dystopia").defaultTo(false).alter();
      tbl.boolean("adventure").defaultTo(false).alter();
      tbl.boolean("memoir").defaultTo(false).alter();
      tbl.boolean("biography").defaultTo(false).alter();
      tbl.boolean("play").defaultTo(false).alter();
      tbl.boolean("musical").defaultTo(false).alter();
      tbl.boolean("theatre").defaultTo(false).alter();
    });
};

exports.down = async (knex) => {
  return knex.schema
    .dropTableIfExists("genres")
    .dropTableIfExists("content_library")
    .dropTableIfExists("author_content");
};
