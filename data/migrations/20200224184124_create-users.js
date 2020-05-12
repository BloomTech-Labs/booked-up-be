
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments()
        tbl.string('user_type', 255).notNullable()
        tbl.string('first_name', 255).notNullable()
        tbl.string('last_name', 255).notNullable()
        tbl.string('display_name', 255).unique()
        tbl.string('password', 255).notNullable()
        tbl.string('email', 255).notNullable().unique()
        tbl.string('city', 255)
        tbl.string('state', 255)
        tbl.string('country', 255)
        tbl.string('avatar_url', 255)
        tbl.boolean('email_verification').defaultTo(true)
        tbl.boolean('password_reset').defaultTo(false)
        tbl.timestamp('created_at').defaultTo(knex.fn.now());
    })
      .createTable('admins', tbl => {
        tbl.increments()
        tbl.string('user_type', 255).notNullable()
        tbl.string('first_name', 255).notNullable()
        tbl.string('last_name', 255).notNullable()
        tbl.string('password', 255).notNullable()
        tbl.string('email', 255).notNullable().unique()
        tbl.boolean('email_verification').defaultTo(false)
        tbl.boolean('password_reset').defaultTo(false)
        tbl.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .createTable('agent_info', tbl => {
        tbl.increments()
        tbl.string('agent_type', 255)
        tbl.string('agency_name', 255)
        tbl.string('agency_address', 255)
        tbl.text('agency_phone_number', 255)
        tbl.string('agency_email', 255)
        tbl.integer('user_id', 255).notNullable()
            .unsigned()
            .notNullable()
            .references('users.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
      })
      .createTable('author_content', tbl => {
        tbl.increments()
        tbl.string('title', 255)
        tbl.string('content_url', 255)
        tbl.timestamp('created_at').defaultTo(knex.fn.now())
        tbl.timestamp('last_updated').defaultTo(knex.fn.now())
        tbl.integer('user_id', 255)
            .unsigned()
            .notNullable()
            .references('users.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
      })
      
      .raw(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
       NEW."last_updated"=now(); 
       RETURN NEW;
      END;
      $$ language 'plpgsql';
    `)
    .raw(`
      CREATE TRIGGER update_user_updated_at BEFORE UPDATE
      ON ?? FOR EACH ROW EXECUTE PROCEDURE 
      update_updated_at_column();
    `, ['author_content'])
    
      .createTable('content_library', tbl => {
        tbl.increments()
        tbl.integer('user_id', 255)
            .unsigned()
            .notNullable()
            .references('users.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        tbl.integer('author_content_id', 255)
            .unsigned()
            .notNullable()
            .references('author_content.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
      });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('content_library').dropTableIfExists('author_content').dropTableIfExists('agent_info').dropTableIfExists('admins').dropTableIfExists('users');
};

