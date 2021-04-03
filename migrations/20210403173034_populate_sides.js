exports.up = function(knex) {
    return knex('sides')
        .insert([
            { id: 'role', name: 'Role' },
            { id: 'province', name: 'Province' },
            { id: 'dynasty', name: 'Dynasty' },
            { id: 'conflict', name: 'Conflict' },
            { id: 'treaty', name: 'Treaty' },
        ])
};

exports.down = function(knex) {
    return knex('sides')
        .whereIn('id', ['role', 'province', 'dynasty', 'conflict', 'treaty'])
        .delete()
};
