
exports.up = function(knex) {
  return knex('user_roles')
        .insert([
          {name: 'rules_admin'},
          {name: 'data_admin'}
        ])
};

exports.down = function(knex) {
  return knex('user_roles')
        .whereIn('name', ['rules_admin', 'data_admin'])
        .delete()
};
