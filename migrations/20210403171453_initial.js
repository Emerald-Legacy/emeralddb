
exports.up = function(knex) {
    return knex.schema
        .createTable('clans', function(table) {
            table.string('id').primary()
            table.string('name').notNullable()
        })
        .createTable('elements', function(table) {
            table.string('id').primary()
            table.string('name').notNullable()
        })
        .createTable('sides', function(table) {
            table.string('id').primary()
            table.string('name').notNullable()
        })
        .createTable('traits', function(table) {
            table.string('id').primary()
            table.string('name').notNullable()
        })
        .createTable('role_restrictions', function(table) {
            table.string('id').primary()
            table.string('name').notNullable()
        })
        .createTable('types', function(table) {
            table.string('id').primary()
            table.string('name').notNullable()
        })
        .createTable('formats', function(table) {
            table.string('id').primary()
            table.string('name').notNullable()
        })
        .createTable('factions', function(table) {
            table.string('id').primary()
            table.string('name').notNullable()
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('factions')
        .dropTable('formats')
        .dropTable('types')
        .dropTable('role_restrictions')
        .dropTable('traits')
        .dropTable('sides')
        .dropTable('elements')
        .dropTable('clans')
};
