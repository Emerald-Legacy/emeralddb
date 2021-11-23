import { pg } from './pg'
import { CardInPack } from '@5rdb/api'

export const TABLE = 'cards_in_packs'

const PRIMARY_KEY_CONSTRAINT = 'cards_in_packs_pkey'

export async function getAllCardsInPacks(): Promise<CardInPack[]> {
  return pg(TABLE).select()
}

export async function getAllCardVersions(cardId: string): Promise<CardInPack[]> {
  return pg(TABLE).where('card_id', cardId)
}

export async function getAllCardsInPack(packId: string): Promise<CardInPack[]> {
  return pg(TABLE).where('pack_id', packId)
}

export async function deleteCardInPack(cardId: string, packId: string): Promise<CardInPack[]> {
  return pg(TABLE).where({ card_id: cardId, pack_id: packId }).delete()
}

export async function insertOrUpdateCardInPack(cardInPack: CardInPack): Promise<CardInPack> {
  const insert = pg(TABLE).insert({ ...cardInPack })
  const update = pg.queryBuilder().update({ ...cardInPack })
  const result = await pg.raw(
    `? ON CONFLICT ON CONSTRAINT ${PRIMARY_KEY_CONSTRAINT} DO ? returning *`,
    [insert, update]
  )
  return result.rows[0]
}
