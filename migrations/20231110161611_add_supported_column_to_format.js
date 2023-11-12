
exports.up = function(knex) {
  return knex.schema
    .table('formats', function(table) {
      table.boolean('supported').notNullable().defaultTo(true)
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('formats', function(table) {
      table.dropColumn('supported')
    })
};
