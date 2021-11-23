
exports.up = function(knex) {
  return knex.schema
        .table('cards', function(table) {
          table.specificType('splash_banned_in', 'varchar(255)[]')
        })
};

exports.down = function(knex) {
  return knex.schema
        .table('cards', function(table) {
          table.dropColumn('splash_banned_in')
        })
};
