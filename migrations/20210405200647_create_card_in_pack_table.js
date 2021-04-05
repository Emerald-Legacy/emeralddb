
exports.up = function(knex) {
  return knex.schema
    .createTable('cards_in_packs', function(table) {
        table.string('card_id').references('cards.id')
        table.string('pack_id').references('packs.id')
        table.string('flavor')
        table.string('illustrator')
        table.string('image_url')
        table.string('position')
        table.integer('quantity')
        table.primary(['card_id', 'pack_id']);
    })
};

exports.down = function(knex) {
  return knex.schema
      .dropTable('cards_in_packs')
};

