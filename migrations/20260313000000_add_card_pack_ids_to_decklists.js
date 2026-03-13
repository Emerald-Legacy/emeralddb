
exports.up = async function (knex) {
  await knex.schema.alterTable('decklists', function (table) {
    table.jsonb('card_pack_ids')
  })

  // Populate card_pack_ids for all existing decklists
  const formats = await knex('formats').select('id', 'legal_packs')
  const legalPacksByFormat = {}
  for (const format of formats) {
    if (format.legal_packs) {
      legalPacksByFormat[format.id] = new Set(format.legal_packs)
    }
  }

  const cardsInPacks = await knex('cards_in_packs').select('card_id', 'pack_id', 'rotated')

  // Build a lookup: card_id -> [pack_ids] (non-rotated only)
  const packsByCard = {}
  for (const cip of cardsInPacks) {
    if (!cip.rotated) {
      if (!packsByCard[cip.card_id]) {
        packsByCard[cip.card_id] = []
      }
      packsByCard[cip.card_id].push(cip.pack_id)
    }
  }

  const decklists = await knex('decklists').select('id', 'format', 'cards')
  for (const decklist of decklists) {
    const legalPacks = legalPacksByFormat[decklist.format]
    if (!legalPacks) {
      continue
    }

    const cards = typeof decklist.cards === 'string' ? JSON.parse(decklist.cards) : decklist.cards
    const cardPackIds = {}
    for (const cardId of Object.keys(cards)) {
      const packs = packsByCard[cardId]
      if (packs) {
        const legalPack = packs.find((p) => legalPacks.has(p))
        if (legalPack) {
          cardPackIds[cardId] = legalPack
        }
      }
    }

    if (Object.keys(cardPackIds).length > 0) {
      await knex('decklists')
        .where('id', decklist.id)
        .update({ card_pack_ids: JSON.stringify(cardPackIds) })
    }
  }
}

exports.down = function (knex) {
  return knex.schema.alterTable('decklists', function (table) {
    table.dropColumn('card_pack_ids')
  })
}
