
exports.up = function(knex) {
  return knex.schema
    .table('formats', function(table) {
      table.text('info_link').nullable()
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('formats', function(table) {
      table.dropColumn('info_link')
    })
};
