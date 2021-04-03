exports.up = function(knex) {
    return knex('role_restrictions')
        .insert([
            { id: 'air', name: 'Air' },
            { id: 'earth', name: 'Earth' },
            { id: 'fire', name: 'Fire' },
            { id: 'void', name: 'Void' },
            { id: 'water', name: 'Water' },
            { id: 'keeper', name: 'Keeper' },
            { id: 'seeker', name: 'Seeker' },
        ])
};

exports.down = function(knex) {
    return knex('role_restrictions')
        .whereIn('id', ['air', 'earth', 'fire', 'void', 'water', 'keeper', 'seeker'])
        .delete()
};
