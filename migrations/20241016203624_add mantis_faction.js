
exports.up = function(knex) {
  return knex('factions')
    .insert([
      { id: 'mantis', name: 'Mantis' },
    ])
};

exports.down = function(knex) {
  return knex('factions')
    .whereIn('id', ['mantis'])
    .delete()
};
