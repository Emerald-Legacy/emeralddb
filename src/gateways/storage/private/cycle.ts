import { pg } from './pg'

export const TABLE = 'cycles'

export interface CycleRecord {
  id: string
  name: string
  position: number
  size: number
}

export async function getAllCycles(): Promise<CycleRecord[]> {
  return pg(TABLE).select()
}

export async function getCycle(cycleId: string): Promise<CycleRecord> {
  return pg(TABLE).where('id', cycleId).first()
}

export async function insertOrUpdateCycle(cycle: CycleRecord): Promise<CycleRecord> {
  const insert = pg(TABLE).insert({ ...cycle })
  const update = pg.queryBuilder().update({ ...cycle })
  const result = await pg.raw(`? ON CONFLICT ("id") DO ? returning *`, [insert, update])
  return result.rows[0]
}
