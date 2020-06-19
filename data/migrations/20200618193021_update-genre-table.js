exports.up = async (knex) => {
  return knex.schema.table("genres", (tbl) => {
    tbl.dropColumn("thriller");
    tbl.dropColumn("detective");
    tbl.dropColumn("dystopia");
    tbl.dropColumn("adventure");
    tbl.dropColumn("memoir");
    tbl.dropColumn("biography");
    tbl.dropColumn("play");
    tbl.dropColumn("musical");
    tbl.dropColumn("theatre");

    tbl.boolean("classic").defaultTo(false);
    tbl.boolean("comicsGraphicNovel").defaultTo(false);
    tbl.boolean("contemporary").defaultTo(false);
    tbl.boolean("crimeDetective").defaultTo(false);
    tbl.boolean("fable").defaultTo(false);
    tbl.boolean("fairyTale").defaultTo(false);
    tbl.boolean("folktale").defaultTo(false);
    tbl.boolean("historicalFiction").defaultTo(false);
    tbl.boolean("humor").defaultTo(false);
    tbl.boolean("legend").defaultTo(false);
    tbl.boolean("magicalRealism").defaultTo(false);
    tbl.boolean("metaFiction").defaultTo(false);
    tbl.boolean("mythology").defaultTo(false);
    tbl.boolean("mythopoeia").defaultTo(false);
    tbl.boolean("pictureBook").defaultTo(false);
    tbl.boolean("realisticFiction").defaultTo(false);
    tbl.renameColumn("science_fiction", "scienceFiction");
    tbl.boolean("shortStory").defaultTo(false);
    tbl.boolean("suspenseThriller").defaultTo(false);
    tbl.boolean("swashbuckler").defaultTo(false);
    tbl.boolean("tallTale").defaultTo(false);
    tbl.boolean("theologicalFiction").defaultTo(false);
  });
};

exports.down = async (knex) => {
  return knex.schema.table("genres", (tbl) => {
    tbl.dropColumn("classic");
    tbl.dropColumn("comicsGraphicNovel");
    tbl.dropColumn("contemporary");
    tbl.dropColumn("crimeDetective");
    tbl.dropColumn("fable");
    tbl.dropColumn("fairyTale");
    tbl.dropColumn("folktale");
    tbl.dropColumn("historicalFiction");
    tbl.dropColumn("humor");
    tbl.dropColumn("legend");
    tbl.dropColumn("magicalRealism");
    tbl.dropColumn("metaFiction");
    tbl.dropColumn("mythology");
    tbl.dropColumn("mythopoeia");
    tbl.dropColumn("pictureBook");
    tbl.dropColumn("realisticFiction");
    tbl.dropColumn("science_fiction", "scienceFiction");
    tbl.dropColumn("shortStory");
    tbl.dropColumn("suspenseThriller");
    tbl.dropColumn("swashbuckler");
    tbl.dropColumn("tallTale");
    tbl.dropColumn("theologicalFiction");
  });
};
