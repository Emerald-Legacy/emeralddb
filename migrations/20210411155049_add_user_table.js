exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
        table.string('id').primary()
        table.string('name')
        table.specificType('roles', 'varchar(255)[]')
    })
};

exports.down = function(knex) {
  return knex.schema
      .dropTable('users')
};
