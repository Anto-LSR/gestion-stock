/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.dropTableIfExists('articles');
    
    return knex.schema.createTable('articles', function(table) {
      table.increments('id').primary(); // Clé primaire auto-incrémentée
      table.string('designation').notNullable(); // Désignation de l'article
      table.decimal('prix', 10, 2).notNullable(); // Prix de l'article avec deux décimales
      table.text('description'); // Description de l'article
      table.boolean('is_active').defaultTo(true); // Statut actif/inactif
      table.timestamps(true, true); // Champs created_at et updated_at
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('articles');
  };