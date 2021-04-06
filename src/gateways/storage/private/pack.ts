import { pg } from './pg'
import { Pack } from '@5rdb/api'

export const TABLE = 'packs'

export async function getAllPacks(): Promise<Pack[]> {
  return pg(TABLE).select()
}

export async function getPack(packId: string): Promise<Pack> {
  return pg(TABLE).where('id', packId).first()
}

export async function insertOrUpdatePack(pack: Pack): Promise<Pack> {
  const insert = pg(TABLE).insert({ ...pack })
  const update = pg.queryBuilder().update({ ...pack })
  const result = await pg.raw(`? ON CONFLICT ("id") DO ? returning *`, [insert, update])
  return result.rows[0]
}
