exports.up = function(knex) {
    return knex.schema.createTable('commande_lignes', function(table) {
      table.increments('id').primary();
      table.integer('commande_id').unsigned().notNullable();
      table.integer('article_id').unsigned().notNullable();
      table.integer('qt').notNullable();
      table.decimal('prix_unitaire', 10, 2).notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('commande_lignes');
  };
  