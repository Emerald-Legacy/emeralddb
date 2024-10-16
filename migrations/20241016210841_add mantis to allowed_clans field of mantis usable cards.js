
exports.up = function(knex) {
  knex('cards')
    .whereRaw('? = any (??)', ['crab', 'allowed_clans'])
    .andWhereRaw('? = any (??)', ['crane', 'allowed_clans'])
    .update({
      allowed_clans: knex.raw('array_append(allowed_clans, ?)', ['mantis'])
    })
    .then((value) => console.log(value.toString()))
}

exports.down = function(knex) {
  knex('cards')
    .whereRaw('? = any (??)', ['mantis', 'allowed_clans'])
    .update({
      allowed_clans: knex.raw('array_remove(allowed_clans, ?)', ['mantis'])
    })
}
