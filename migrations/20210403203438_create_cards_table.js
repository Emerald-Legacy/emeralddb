
exports.up = function(knex) {
    return knex.schema
        .createTable('cards', function(table) {
            // General Card Info
            table.string('id').primary()
            table.string('name').notNullable()
            table.string('name_extra')
            table.string('clan').references('factions.id').notNullable()
            table.string('side').references('sides.id').notNullable()
            table.string('type').references('types.id').notNullable()
            table.boolean('is_unique').notNullable()
            table.string('role_restriction').references('role_restrictions.id')
            table.string('text', 1000)
            table.specificType('restricted_in', 'varchar(255)[]')
            table.specificType('banned_in', 'varchar(255)[]')
            table.specificType('allowed_clans', 'varchar(255)[]')
            table.specificType('traits', 'varchar(255)[]')
            table.string('cost')
            table.integer('deck_limit')
            table.integer('influence_cost')
            // Province Card Info
            table.specificType('elements', 'varchar(255)[]')
            table.string('strength')
            // Stronghold Card Info
            table.integer('glory')
            table.integer('fate')
            table.integer('honor')
            table.integer('influence_pool')
            // Holding Card Info
            table.string('strength_bonus')
            // Character Card Info
            table.string('military')
            table.string('political')
            // Attachment Card Info
            table.string('military_bonus')
            table.string('political_bonus')
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('cards')
};
