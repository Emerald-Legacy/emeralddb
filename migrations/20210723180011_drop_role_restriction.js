
exports.up = function(knex) {
  return knex.schema
    .table('cards', function(table) {
      table.dropColumn('role_restriction')
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('cards', function(table) {
      table.string('role_restriction')
    })
};
