import { pg } from './pg'

export const TABLE = 'packs'

export interface PackRecord {
  id: string
  name: string
  position: number
  size: number
  released_at?: Date
  publisher_id?: string
  cycle_id: string
}

export async function getAllPacks(): Promise<PackRecord[]> {
  return pg(TABLE).select()
}

export async function getPack(packId: string): Promise<PackRecord> {
  return pg(TABLE).where('id', packId).first()
}

export async function insertOrUpdatePack(pack: PackRecord): Promise<PackRecord> {
  const insert = pg(TABLE).insert({ ...pack })
  const update = pg.queryBuilder().update({ ...pack })
  const result = await pg.raw(`? ON CONFLICT ("id") DO ? returning *`, [insert, update])
  return result.rows[0]
}
