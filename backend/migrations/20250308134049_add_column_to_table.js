exports.up = function(knex) {
    return knex.schema.alterTable('clients', function(table) {
      table.boolean('is_active'); // Ajoute une colonne "email" de type string
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('clients', function(table) {
      table.dropColumn('is_active'); // Supprime la colonne "email"
    });
  };