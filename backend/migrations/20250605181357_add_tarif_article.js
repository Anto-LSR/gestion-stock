exports.up = function(knex) {
  return knex.schema.createTable('article_tarifs', function(table) {
    table.increments('id').primary();
    table.integer('id_article').notNullable(); // Pas de foreign key
    table.decimal('pu', 10, 2).notNullable();  // Prix unitaire
    table.date('date').notNullable();          // Date du tarif
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('article_tarifs');
};