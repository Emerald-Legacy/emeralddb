import { User } from '@5rdb/api'
import * as Express from 'express'
import { getOrInsertDBUser } from '../gateways/storage'

export async function handler(req: Express.Request, res: Express.Response): Promise<User> {
  console.log(req.user)
  const currentUser = req.user as User & { sub: string }
  if (!currentUser?.sub) {
    res.status(401).send()
  }
  return await getOrInsertDBUser(currentUser.sub)
}
