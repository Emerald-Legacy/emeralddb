exports.up = function(knex) {
  return knex('formats')
    .insert([
      { id: 'obsidian', name: 'Obsidian'},
    ])
};

exports.down = function(knex) {
  return knex('formats')
    .whereIn('id', ['obsidian'])
    .delete()
};
