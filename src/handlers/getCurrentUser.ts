import { getUser, insertUser } from '../gateways/storage/index'
import { Auth0User } from '../middlewares/authorization'
import { User } from '@5rdb/api'
import * as Express from 'express'

export async function handler(req: Express.Request, res: Express.Response): Promise<User> {
  const currentUser = req.user as Auth0User
  if (!currentUser?.sub) {
    res.status(401).send()
  }
  return await getDBUser(currentUser.sub)
}

export async function getDBUser(userId: string): Promise<User> {
  let dbUser: User = await getUser(userId)
  if (!dbUser) {
    dbUser = await insertUser({ id: userId, name: 'Unnamed Samurai', roles: [] })
  }
  return dbUser
}
