
exports.up = function(knex) {
  return knex('clans')
    .insert([
      { id: 'mantis', name: 'Mantis' },
    ])
};

exports.down = function(knex) {
  return knex('clans')
    .whereIn('id', ['mantis'])
    .delete()
};

