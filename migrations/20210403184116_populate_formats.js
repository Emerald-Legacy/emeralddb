exports.up = function(knex) {
    return knex('formats')
        .insert([
            { id: 'standard', name: 'Stronghold Format' },
            { id: 'single-core', name: 'Single Core Format' },
            { id: 'skirmish', name: 'Skirmish Format' },
            { id: 'jade-edict', name: 'Jade Edict Format' },
            { id: 'enlightenment', name: 'Enlightenment Format' },
        ])
};

exports.down = function(knex) {
    return knex('formats')
        .whereIn('id', ['standard', 'single-core', 'skirmish', 'jade-edict', 'enlightenment'])
        .delete()
};