import { pg } from './pg'

export const TABLE = 'cards_in_packs'

const PRIMARY_KEY_CONSTRAINT = 'cards_in_packs_pkey'

export interface CardInPackRecord {
  card_id: string
  pack_id: string
  flavor?: string
  illustrator?: string
  image_url?: string
  position?: string
  quantity?: number
}

export async function getAllCardVersions(cardId: string): Promise<CardInPackRecord[]> {
  return pg(TABLE).select('card_id', cardId)
}

export async function getAllCardsInPack(packId: string): Promise<CardInPackRecord[]> {
  return pg(TABLE).select('pack_id', packId)
}

export async function insertOrUpdateCardInPack(
  cardInPack: CardInPackRecord
): Promise<CardInPackRecord> {
  const insert = pg(TABLE).insert({ ...cardInPack })
  const update = pg.queryBuilder().update({ ...cardInPack })
  const result = await pg.raw(
    `? ON CONFLICT ON CONSTRAINT ${PRIMARY_KEY_CONSTRAINT} DO ? returning *`,
    [insert, update]
  )
  return result.rows[0]
}
