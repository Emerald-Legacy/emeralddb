
exports.up = function(knex) {
  return knex.schema
    .createTable('decklist_comments', function(table) {
      table.string('id').primary()
      table.string('decklist_id').notNullable()
      table.string('parent_comment_id')
      table.string('user_id').references('users.id').notNullable()
      table.text('comment')
      table.timestamp('created_at').notNullable()
      table.timestamp('edited_at')
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('decklist_comments')
};
