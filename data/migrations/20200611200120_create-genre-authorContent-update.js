exports.up = async (knex) => {
  return knex.schema

    .table("author_content", (tbl) => {
      tbl.string("public_id", 255);
    })

    .table("genres", (tbl) => {
      tbl.string("fantasy").defaultTo(false).alter();
      tbl.string("science_fiction", 255).defaultTo(false).alter();
      tbl.string("horror").defaultTo(false).alter();
      tbl.string("western").defaultTo(false).alter();
      tbl.string("romance").defaultTo(false).alter();
      tbl.string("thriller").defaultTo(false).alter();
      tbl.string("mystery").defaultTo(false).alter();
      tbl.string("detective").defaultTo(false).alter();
      tbl.string("dystopia").defaultTo(false).alter();
      tbl.string("adventure").defaultTo(false).alter();
      tbl.string("memoir").defaultTo(false).alter();
      tbl.string("biography").defaultTo(false).alter();
      tbl.string("play").defaultTo(false).alter();
      tbl.string("musical").defaultTo(false).alter();
      tbl.string("theatre").defaultTo(false).alter();
    });
};

exports.down = async (knex) => {
  return knex.schema
    .dropTableIfExists("author_content")
    .dropTableIfExists("genres");
};
