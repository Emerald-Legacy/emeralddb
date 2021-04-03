
exports.up = function(knex) {
    return knex('clans')
        .insert([
            { id: 'crab', name: 'Crab' },
            { id: 'crane', name: 'Crane' },
            { id: 'dragon', name: 'Dragon' },
            { id: 'lion', name: 'Lion' },
            { id: 'phoenix', name: 'Phoenix' },
            { id: 'scorpion', name: 'Scorpion' },
            { id: 'unicorn', name: 'Unicorn' },
        ])
};

exports.down = function(knex) {
    return knex('clans')
        .whereIn('id', ['crab', 'crane', 'dragon', 'lion', 'phoenix', 'scorpion', 'unicorn'])
        .delete()
};
