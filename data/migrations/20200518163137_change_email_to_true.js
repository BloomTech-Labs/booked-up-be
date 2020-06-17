exports.up = async (knex) => {
  return knex.schema.table("users", (tbl) => {
    tbl.boolean("email_verification").defaultTo(true).alter();
  });
};

exports.down = async (knex) => {
  return knex.schema.table("users", (tbl) => {
    tbl.dropColumn("email_verification");
  });
};
