import { pg } from './pg'
import { Format } from '@5rdb/api'

export const TABLE = 'formats'

export async function getAllFormats(): Promise<Format[]> {
  return pg(TABLE).select()
}

export async function insertOrUpdateFormat(format: Format): Promise<Format> {
  const insert = pg(TABLE).insert({ ...format })
  const update = pg.queryBuilder().update({ ...format })
  const result = await pg.raw(`? ON CONFLICT ("id") DO ? returning *`, [insert, update])
  return result.rows[0]
}
