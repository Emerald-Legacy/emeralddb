import * as Express from 'express'
import Joi from 'joi'
import { ValidatedRequest } from '../middlewares/validator'
import { Traits$delete, Trait } from '@5rdb/api'
import { deleteTrait } from '../gateways/storage/private/trait'

export const schema = {
  body: Joi.object<Traits$delete['request']['body']>({
    trait: Joi.object<Trait>(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema>,
  res: Express.Response
): Promise<void> {
  await deleteTrait(req.body.trait.id)
  res.sendStatus(200)
}
