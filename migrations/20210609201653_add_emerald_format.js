exports.up = function(knex) {
  return knex('formats')
      .insert([
          { id: 'emerald', name: 'Emerald Legacy' },
      ])
};

exports.down = function(knex) {
  return knex('formats')
      .whereIn('id', ['emerald'])
      .delete()
};