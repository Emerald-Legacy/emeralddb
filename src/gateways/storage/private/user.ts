import { User } from '@5rdb/api'
import { pg } from './pg'

export const TABLE = 'users'

export async function getUser(id: string): Promise<User> {
  return pg(TABLE).where('id', id).first()
}

export async function insertUser(user: User): Promise<User> {
  const insert = pg(TABLE).insert({ ...user })
  const update = pg.queryBuilder().update({ ...user })
  const result = await pg.raw(`? ON CONFLICT ("id") DO ? returning *`, [insert, update])
  return result.rows[0]
}

export async function updateUser(user: Omit<User, 'roles'>): Promise<User> {
  const result = await pg(TABLE).where('id', user.id).update({ name: user.name }, '*')
  return result[0]
}
