
exports.up = function(knex) {
  return knex('types')
        .insert([
          { id: 'warlord', name: 'Warlord' },
        ])
};

exports.down = function(knex) {
  return knex('types')
        .whereIn('id', ['warlord'])
        .delete()
};
