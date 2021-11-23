
exports.up = function(knex) {
    return knex('elements')
        .insert([
            { id: 'air', name: 'Air' },
            { id: 'earth', name: 'Earth' },
            { id: 'fire', name: 'Fire' },
            { id: 'void', name: 'Void' },
            { id: 'water', name: 'Water' },
        ])
};

exports.down = function(knex) {
    return knex('elements')
        .whereIn('id', ['air', 'earth', 'fire', 'void', 'water'])
        .delete()
};