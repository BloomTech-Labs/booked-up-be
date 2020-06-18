exports.up = async (knex) => {
  return knex.schema.table("author_content", (tbl) => {
    tbl.string("description", 512).alter();
  });
};
exports.down = async (knex) => {
  return knex.schema.table("author_content", (tbl) => {
    tbl.dropColumn("description");
  });
};
