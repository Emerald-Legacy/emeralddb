import { pg } from './pg'
import { Ruling } from '@5rdb/api'

export const TABLE = 'rulings'

export async function getAllRulings(): Promise<Ruling[]> {
  return pg(TABLE).select()
}

export async function getAllRulingsForCard(cardId: string): Promise<Ruling[]> {
  return pg(TABLE).where('card_id', cardId)
}

export async function getRuling(rulingId: number): Promise<Ruling> {
  return pg(TABLE).where('id', rulingId).first()
}

export async function insertOrUpdateRulingWithExistingId(ruling: Ruling): Promise<Ruling> {
  const insert = pg(TABLE).insert({ ...ruling })
  const update = pg.queryBuilder().update({ ...ruling })
  const result = await pg.raw(`? ON CONFLICT ("id") DO ? returning *`, [insert, update])
  return result.rows[0]
}

export async function insertNewRuling(ruling: Omit<Ruling, 'id'>): Promise<Ruling> {
  return pg(TABLE)
    .insert(ruling, '*')
    .then(([row]) => row)
}
