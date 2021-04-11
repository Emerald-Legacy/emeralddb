import { getOrInsertDBUser, updateUser } from '../gateways/storage/index'
import * as Express from 'express'
import Joi from 'joi'
import { ValidatedRequest } from '../middlewares/validator'
import { Users$update, User } from '@5rdb/api'

export const schema = {
  body: Joi.object<Users$update['request']['body']>({
    id: Joi.string().required(),
    name: Joi.string().required(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema>,
  res: Express.Response
): Promise<User> {
  const currentUser = req.user as User & { sub: string }
  if (!currentUser?.sub) {
    res.status(401).send()
  }
  const dbUser = await getOrInsertDBUser(currentUser.sub)
  if (dbUser.id !== req.body.id) {
    res.status(403).send()
  }
  return updateUser(req.body)
}
