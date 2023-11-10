
exports.up = function(knex) {
  return knex.schema
    .table('cycles', function(table) {
      table.string('publisher').notNullable().defaultTo('ffg')
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('cycles', function(table) {
      table.dropColumn('publisher')
    })
};
