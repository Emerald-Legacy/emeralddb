
exports.up = function(knex) {
    return knex('factions')
        .insert([
            { id: 'crab', name: 'Crab' },
            { id: 'crane', name: 'Crane' },
            { id: 'dragon', name: 'Dragon' },
            { id: 'lion', name: 'Lion' },
            { id: 'phoenix', name: 'Phoenix' },
            { id: 'scorpion', name: 'Scorpion' },
            { id: 'unicorn', name: 'Unicorn' },
            { id: 'neutral', name: 'Neutral' },
            { id: 'shadowlands', name: 'Shadowlands' },
        ])
};

exports.down = function(knex) {
    return knex('factions')
        .whereIn('id', ['crab', 'crane', 'dragon', 'lion', 'phoenix', 'scorpion', 'unicorn', 'neutral', 'shadowlands'])
        .delete()
};
