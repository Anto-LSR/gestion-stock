exports.up = function(knex) {
  return knex.schema.table('commandes', function(table) {
    table.boolean('facturation').notNullable().defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('commandes', function(table) {
    table.dropColumn('facturation');
  });
};