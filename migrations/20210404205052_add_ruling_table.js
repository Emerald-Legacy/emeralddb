
exports.up = function(knex) {
  return knex.schema
    .createTable('rulings', function(table) {
        table.increments('id').primary()
        table.string('card_id').references('cards.id').notNullable()
        table.string('link')
        table.string('source')
        table.string('text', 2550).notNullable()
    })
};

exports.down = function(knex) {
  return knex.schema
      .dropTable('rulings')
};