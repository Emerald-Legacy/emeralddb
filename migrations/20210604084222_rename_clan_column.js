
exports.up = function(knex) {
  return knex.schema
        .table('cards', function(table) {
          table.renameColumn('clan', 'faction')
        })
};

exports.down = function(knex) {
  return knex.schema
        .table('cards', function(table) {
          table.renameColumn('faction', 'clan')
        })
};
