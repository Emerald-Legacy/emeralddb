
exports.up = function(knex) {
  return knex.schema
    .createTable('user_roles', function(table) {
        table.string('name').primary()
    })
};

exports.down = function(knex) {
  return knex.schema
      .dropTable('user_roles')
};
