import { insertOrUpdateFormat } from '../gateways/storage'
import Joi from 'joi'
import { ValidatedRequest } from '../middlewares/validator'
import { Format, Formats$insertOrUpdate } from '@5rdb/api'

export const schema = {
  body: Joi.object<Formats$insertOrUpdate['request']['body']>({
    format: Joi.object<Format>(),
  }),
}

export async function handler(req: ValidatedRequest<typeof schema>): Promise<Format | undefined> {
  return insertOrUpdateFormat(req.body.format)
}
