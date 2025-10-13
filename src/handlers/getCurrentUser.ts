import { User } from '@5rdb/api'
import * as Express from 'express'
import { getOrInsertDBUser } from '../gateways/storage'

export async function handler(
  req: Express.Request,
  res: Express.Response
): Promise<User | undefined> {
  const currentUser = (req as any).auth as User & { sub: string }
  if (!currentUser?.sub) {
    res.status(401).send()
    return
  }
  return await getOrInsertDBUser(currentUser.sub)
}
