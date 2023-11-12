import { insertOrUpdateCycle } from '../gateways/storage/index'
import Joi from 'joi'
import { ValidatedRequest } from '../middlewares/validator'
import { Cycle, Cycles$create } from '@5rdb/api'

export const schema = {
  body: Joi.object<Cycles$create['request']['body']>({
    id: Joi.string().required(),
    name: Joi.string().required(),
    position: Joi.number().required(),
    size: Joi.number().required(),
    publisher: Joi.string().required(),
  }),
}

export async function handler(req: ValidatedRequest<typeof schema>): Promise<Cycle | undefined> {
  return insertOrUpdateCycle(req.body)
}
