exports.up = async function(knex) {
    await knex.schema.table('clients', function(table) {
      table.string('address', 255);  // Ajoute une colonne pour l'adresse
      table.string('email', 255);    // Ajoute une colonne pour l'email
      table.string('phone', 20); // Ajoute une colonne pour le téléphone
    });
  };
  
  exports.down = async function(knex) {
    await knex.schema.table('clients', function(table) {
      table.dropColumn('address');   // Supprime la colonne 'address'
      table.dropColumn('email');     // Supprime la colonne 'email'
      table.dropColumn('phone'); // Supprime la colonne 'telephone'
    });
  };
  