// migrations/xxxx_add_stock_columns_to_articles.js

exports.up = function(knex) {
  return knex.schema.table('articles', function(table) {
    table.integer('stock_reel').notNullable().defaultTo(0);
    table.integer('stock_previsionnel').notNullable().defaultTo(0);
    table.integer('stock_reserve').notNullable().defaultTo(0); // optionnel, sinon calculable
  });
};

exports.down = function(knex) {
  return knex.schema.table('articles', function(table) {
    table.dropColumn('stock_reel');
    table.dropColumn('stock_previsionnel');
    table.dropColumn('stock_reserve');
  });
};
