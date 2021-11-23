
exports.up = function(knex) {
  return knex.schema
    .createTable('cycles', function(table) {
        table.string('id').primary()
        table.string('name')
        table.integer('position')
        table.integer('size')
    })
};

exports.down = function(knex) {
  return knex.schema
      .dropTable('cycles')
};
