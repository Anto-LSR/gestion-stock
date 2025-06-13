// 20250308102803_create_clients.js
exports.up = function(knex) {
    return knex.schema.createTable('clients', function(table) {
      table.increments('id').primary();
      table.string('name');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('clients');
  };
  