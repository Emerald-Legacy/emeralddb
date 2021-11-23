
exports.up = function(knex) {
  return knex.schema
    .createTable('packs', function(table) {
        table.string('id').primary()
        table.string('name')
        table.integer('position')
        table.integer('size')
        table.date('released_at')
        table.string('publisher_id')
        table.string('cycle_id').references('cycles.id')
    })
};

exports.down = function(knex) {
  return knex.schema
      .dropTable('packs')
};
