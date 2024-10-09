
exports.up = function(knex) {
  return knex.schema
    .table('formats', function(table) {
      table.integer('position').notNullable().defaultTo(100)
      table.string('maintainer').nullable()
      table.string('description').nullable()
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('formats', function(table) {
      table.dropColumn('position')
      table.dropColumn('maintainer')
      table.dropColumn('description')
    })
};
