exports.up = async function(knex) {
  // 1. Renommer l'ancienne table
  await knex.schema.renameTable('articles', 'articles_old');

  // 2. Recréer la nouvelle table sans la colonne `prix`
  await knex.schema.createTable('articles', function(table) {
    table.increments('id').primary();
    table.string('designation').notNullable();
    table.text('description');
    table.boolean('is_active').defaultTo(true);
    table.integer('stock_reel').notNullable().defaultTo(0);
    table.integer('stock_previsionnel').notNullable().defaultTo(0);
    table.integer('stock_reserve').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });

  // 3. Copier les données (en excluant `prix`)
  await knex.raw(`
    INSERT INTO articles (id, designation, description, is_active, stock_reel, stock_previsionnel, stock_reserve, created_at, updated_at)
    SELECT id, designation, description, is_active, stock_reel, stock_previsionnel, stock_reserve, created_at, updated_at
    FROM articles_old
  `);

  // 4. Supprimer l’ancienne table
  await knex.schema.dropTable('articles_old');
};

exports.down = async function(knex) {
  // Recréer la version avec prix si on rollback
  await knex.schema.renameTable('articles', 'articles_new');

  await knex.schema.createTable('articles', function(table) {
    table.increments('id').primary();
    table.string('designation').notNullable();
    table.decimal('prix', 10, 2).notNullable();
    table.text('description');
    table.boolean('is_active').defaultTo(true);
    table.integer('stock_reel').notNullable().defaultTo(0);
    table.integer('stock_previsionnel').notNullable().defaultTo(0);
    table.integer('stock_reserve').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });

  // ⚠️ Le champ `prix` ne peut pas être restauré sans valeur par défaut → on met 0
  await knex.raw(`
    INSERT INTO articles (id, designation, prix, description, is_active, stock_reel, stock_previsionnel, stock_reserve, created_at, updated_at)
    SELECT id, designation, 0, description, is_active, stock_reel, stock_previsionnel, stock_reserve, created_at, updated_at
    FROM articles_new
  `);

  await knex.schema.dropTable('articles_new');
};
