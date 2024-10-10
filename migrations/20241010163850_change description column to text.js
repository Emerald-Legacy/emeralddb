
exports.up = function(knex) {
  return knex.schema
    .table('formats', function(table) {
      table.text('description').alter()
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('formats', function(table) {
      table.string('description').alter()
    })
};
