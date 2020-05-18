exports.up = async (knex) => {
  return knex.schema.table("users", (tbl) => {
    tbl.boolean("email_verification").defaultTo(false).alter();
  });
};

exports.down = async (knex) => {
  knex.schema.table("users", (tbl) => {
    tbl.dropTableIfExists("users");
  });
};
