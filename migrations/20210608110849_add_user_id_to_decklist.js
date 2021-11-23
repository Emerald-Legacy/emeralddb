
exports.up = function(knex) {
  return knex.schema.table('decklists', function(table) {
    table.string('user_id').references('users.id')
  })
};

exports.down = function(knex) {
  return knex.schema.table('decklists', function(table) {
    table.dropColumn('user_id')
  })
};
