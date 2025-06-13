exports.up = async function(knex) {
    await knex.schema.dropTableIfExists('clients');
  
    await knex.schema.createTable('clients', function(table) {
      table.increments('id').primary(); // Clé primaire auto-incrémentée
      table.string('name', 255).notNullable();
      table.boolean('is_active').defaultTo(true);
    });
  };
  
  exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('clients');
  };
  