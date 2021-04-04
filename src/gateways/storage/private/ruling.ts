import { pg } from './pg'

export const TABLE = 'rulings'

export interface RulingRecord {
  id: number
  card_id: string
  text: string
  source: string
  link: string
}

export async function getAllRulings(): Promise<RulingRecord[]> {
  return pg(TABLE).select()
}

export async function getRuling(rulingId: number): Promise<RulingRecord> {
  return pg(TABLE).where('id', rulingId).first()
}

export async function insertOrUpdateRuling(ruling: RulingRecord): Promise<RulingRecord> {
  const insert = pg(TABLE).insert({ ...ruling })
  const update = pg.queryBuilder().update({ ...ruling })
  const result = await pg.raw(`? ON CONFLICT ("id") DO ? returning *`, [insert, update])
  return result.rows[0]
}
