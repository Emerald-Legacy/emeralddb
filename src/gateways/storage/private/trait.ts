import { pg } from './pg'
import { Trait } from '@5rdb/api'

export const TABLE = 'traits'

export async function getAllTraits(): Promise<Trait[]> {
  return pg(TABLE).select()
}

export async function getTrait(traitId: string): Promise<Trait> {
  return pg(TABLE).where('id', traitId).first()
}

export async function insertOrUpdateTrait(trait: Trait): Promise<Trait> {
  const insert = pg(TABLE).insert({ ...trait })
  const update = pg.queryBuilder().update({ ...trait })
  const result = await pg.raw(`? ON CONFLICT ("id") DO ? returning *`, [insert, update])
  return result.rows[0]
}
