/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.dropTableIfExists('articles');

  return knex.schema.createTable('articles', function(table) {
    table.increments('id').primary(); // Clé primaire auto-incrémentée
    table.string('designation').notNullable(); // Désignation de l'article
    table.text('description'); // Description de l'article
    table.boolean('is_active').defaultTo(true); // Statut actif/inactif
    table.integer('stock_reel').notNullable().defaultTo(0); // Stock réel
    table.integer('stock_reserve').notNullable().defaultTo(0); // Stock réservé
    table.timestamps(true, true); // Champs created_at et updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return knex.schema.dropTableIfExists('articles');
};
