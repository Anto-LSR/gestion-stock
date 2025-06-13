exports.up = function (knex) {
    return knex.schema.table('commandes', function (table) {
        table.boolean('livree').defaultTo(false);
        table.boolean('payee').defaultTo(false);
        table.boolean('finalisee').defaultTo(false);
    });
};

exports.down = function (knex) {
    return knex.schema.table('commandes', function (table) {
        table.dropColumn('livree');
        table.dropColumn('payee');
        table.dropColumn('finalisee');
    });
};
