import { insertOrUpdateTrait } from '../gateways/storage/index'
import * as Express from 'express'
import Joi from 'joi'
import { ValidatedRequest } from '../middlewares/validator'
import { Traits$insertOrUpdate, Trait } from '@5rdb/api'

export const schema = {
  body: Joi.object<Traits$insertOrUpdate['request']['body']>({
    trait: Joi.object<Trait>(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema>,
  res: Express.Response
): Promise<void> {
  await insertOrUpdateTrait(req.body.trait)
  res.sendStatus(200)
}
