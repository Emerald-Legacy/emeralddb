import { pg } from './pg'

export const TABLE = 'traits'

export interface TraitRecord {
  id: string
  name: string
}

export async function getAllTraits(): Promise<TraitRecord[]> {
  return pg(TABLE).select()
}

export async function getTrait(traitId: string): Promise<TraitRecord> {
  return pg(TABLE).where('id', traitId).first()
}

export async function insertOrUpdateTrait(trait: TraitRecord): Promise<TraitRecord> {
  const insert = pg(TABLE).insert({ ...trait })
  const update = pg.queryBuilder().update({ ...trait })
  const result = await pg.raw(`? ON CONFLICT ("id") DO ? returning *`, [insert, update])
  return result.rows[0]
}
