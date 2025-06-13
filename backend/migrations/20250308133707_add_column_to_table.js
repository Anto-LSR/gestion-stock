exports.up = function(knex) {
    return knex.schema.table('clients', function(table) {
      table.boolean('active'); // Ajoute une colonne "email" de type string
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('clients', function(table) {
      table.dropColumn('active'); // Supprime la colonne "email"
    });
  };
