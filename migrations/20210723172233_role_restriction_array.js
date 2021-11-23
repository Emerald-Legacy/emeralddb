
exports.up = function(knex) {
  return knex.schema
    .table('cards', function(table) {
      table.specificType('role_restrictions', 'varchar(255)[]').defaultTo('{}')
    })
    .then(() =>
      knex.table('cards')
        .update('role_restrictions[1]', knex.ref('role_restriction')).whereNotNull('role_restriction')
    )
};

exports.down = function(knex) {
  return knex.schema
    .table('cards', function(table) {
      table.dropColumn('role_restrictions')
    })
};
