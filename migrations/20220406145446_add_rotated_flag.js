
exports.up = function(knex) {
  return knex.schema
    .table('cards_in_packs', function(table) {
      table.boolean('rotated').notNullable().defaultTo(false)
    })
    .table('packs', function(table) {
      table.boolean('rotated').notNullable().defaultTo(false)
    })
    .table('cycles', function(table) {
      table.boolean('rotated').notNullable().defaultTo(false)
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('cards_in_packs', function(table) {
      table.dropColumn('rotated')
    })
    .table('packs', function(table) {
      table.dropColumn('rotated')
    })
    .table('cycles', function(table) {
      table.dropColumn('rotated')
    })
};
