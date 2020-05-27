exports.up = function (knex) {
    return knex.schema
        .createTable("comments", tbl => {
            tbl.increments();
            tbl.string("comment", 300).notNullable();
            tbl.integer("author_content_id", 255);
            tbl.timestamp("created_at").defaultTo(knex.fn.now());
            tbl.timestamp("last_updated").defaultTo(knex.fn.now());
            tbl
                .integer("user_id", 255)
                .unsigned()
                .notNullable()
                .references("users.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
        })

        .raw(
            `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
       NEW."last_updated"=now(); 
       RETURN NEW;
      END;
      $$ language 'plpgsql';
    `
        )
        .raw(
            `
      CREATE TRIGGER update_user_updated_at BEFORE UPDATE
      ON ?? FOR EACH ROW EXECUTE PROCEDURE 
      update_updated_at_column();
    `,
            ["comments"]
        )

        .createTable("messages", tbl => {
            tbl.increments();
            tbl.string("subject", 255);
            tbl.string("body", 255);
            tbl.timestamp("created_at").defaultTo(knex.fn.now());
            tbl.boolean("success_verification").defaultTo(false);
            tbl
                .integer("sender_id")
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

        .createTable("message-inbox", tbl => {
            tbl.increments();
            tbl
                .integer("user_id")
                .unsigned()
                .notNullable()
                .references("users.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            tbl
                .integer("message_id")
                .unsigned()
                .notNullable()
                .references("messages.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");

        })

}


exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("message-inbox")
        .dropTableIfExists("messages")
        .dropTableIfExists("comments")
};