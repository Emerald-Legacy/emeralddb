
exports.up = function(knex) {
  return knex.schema
  .table('decklists', function(table) {
    table.text('description').alter()
  })
  .table('cards_in_packs', function(table) {
    table.text('flavor').alter()
  })
};

exports.down = function(knex) {
  return knex.schema
  .table('decklists', function(table) {
    table.string('description').alter()
  })
  .table('cards_in_packs', function(table) {
    table.string('flavor').alter()
  })
};
