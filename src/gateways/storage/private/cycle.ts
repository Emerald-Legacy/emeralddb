import { pg } from './pg'
import { Cycle } from '@5rdb/api'

export const TABLE = 'cycles'

export async function getAllCycles(): Promise<Cycle[]> {
  return pg(TABLE).select()
}

export async function getCycle(cycleId: string): Promise<Cycle> {
  return pg(TABLE).where('id', cycleId).first()
}

export async function insertOrUpdateCycle(cycle: Cycle): Promise<Cycle> {
  const insert = pg(TABLE).insert({ ...cycle })
  const update = pg.queryBuilder().update({ ...cycle })
  const result = await pg.raw(`? ON CONFLICT ("id") DO ? returning *`, [insert, update])
  return result.rows[0]
}
