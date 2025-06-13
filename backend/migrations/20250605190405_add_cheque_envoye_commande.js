exports.up = function(knex) {
  return knex.schema.alterTable('commandes', function(table) {
    table.boolean('cheque_envoye').notNullable().defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('commandes', function(table) {
    table.dropColumn('cheque_envoye');
  });
};
