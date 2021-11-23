
exports.up = function(knex) {
  return knex.schema
    .createTable('decks', function(table) {
      table.string('id').primary()
      table.string('user_id').references('users.id').notNullable()
      table.string('forked_from')
    })
    .createTable('decklists', function(table) {
      table.string('id').primary()
      table.string('deck_id').references('decks.id').notNullable()
      table.string('format').notNullable()
      table.string('name').notNullable()
      table.string('primary_clan')
      table.string('secondary_clan')
      table.string('description')
      table.string('version_number').notNullable()
      table.jsonb('cards').notNullable()
      table.timestamp('published_date')
      table.timestamp('created_at').notNullable()
    }) 
};

exports.down = function(knex) {
  return knex.schema
        .dropTable('decks')
        .dropTable('decklists')
};
