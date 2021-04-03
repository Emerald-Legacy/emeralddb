exports.up = function(knex) {
    return knex('types')
        .insert([
            { id: 'character', name: 'Character' },
            { id: 'attachment', name: 'Attachment' },
            { id: 'event', name: 'Event' },
            { id: 'holding', name: 'Holding' },
            { id: 'stronghold', name: 'Stronghold' },
            { id: 'province', name: 'Province' },
            { id: 'treaty', name: 'Treaty' },
            { id: 'role', name: 'Role' },
        ])
};

exports.down = function(knex) {
    return knex('types')
        .whereIn('id', ['character', 'attachment', 'event', 'holding', 'stronghold', 'province', 'treaty', 'role'])
        .delete()
};