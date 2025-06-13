exports.up = function(knex) {
    return knex.schema.createTable('commandes', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('statut').defaultTo('a_traiter');
      table.timestamp('cree_le').defaultTo(knex.fn.now());
  
      // Exemple de clé étrangère
      // table.foreign('user_id').references('id').inTable('utilisateurs');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('commandes');
  };