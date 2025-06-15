// fichier : YYYYMMDD_create_receptions.js

exports.up = function (knex) {
    return knex.schema
        .createTable('receptions', function (table) {
            table.increments('id').primary();
            table.date('dateReception').notNullable();
        })
        .createTable('reception_lignes', function (table) {
            table.increments('id').primary();
            table.integer('reception_id').notNullable(); // pas de .references()
            table.integer('article_id').notNullable();
            table.integer('qt').notNullable(); // quantité
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('reception_lignes')
        .dropTableIfExists('receptions');
};
