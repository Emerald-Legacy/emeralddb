import { pg } from './pg'
import { Card } from '@5rdb/api'

export const TABLE = 'cards'

export async function getAllCards(): Promise<Card[]> {
  return pg(TABLE).select()
}

export async function getCard(cardId: string): Promise<Card> {
  return pg(TABLE).where('id', cardId).first()
}

export async function insertOrUpdateCard(card: Card): Promise<Card> {
  const insert = pg(TABLE).insert({ ...card })
  const update = pg.queryBuilder().update({ ...card })
  const result = await pg.raw(`? ON CONFLICT ("id") DO ? returning *`, [insert, update])
  return result.rows[0]
}
