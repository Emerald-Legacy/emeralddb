
exports.up = function(knex) {
  return knex.schema
    .table('formats', function(table) {
      table.specificType('legal_packs', 'varchar(255)[]')
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('formats', function(table) {
      table.dropColumn('legal_packs')
    })
};
