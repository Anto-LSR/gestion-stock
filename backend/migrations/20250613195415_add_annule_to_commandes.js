exports.up = function(knex) {
  return knex.schema.alterTable('commandes', function(table) {
    table.boolean('annulee').notNullable().defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('commandes', function(table) {
    table.dropColumn('annulee');
  });
};