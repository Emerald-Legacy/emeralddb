import { insertDecklist } from '../gateways/storage/index'
import Joi from 'joi'
import { ValidatedRequest } from '../middlewares/validator'
import { Decklist, Decklists$create } from '@5rdb/api'

export const schema = {
  body: Joi.object<Decklists$create['request']['body']>({
    deck_id: Joi.string().required(),
    format: Joi.string().required(),
    name: Joi.string().required(),
    primary_clan: Joi.string(),
    secondary_clan: Joi.string(),
    description: Joi.string(),
    version_number: Joi.string().required(),
    cards: Joi.object().pattern(Joi.string(), Joi.number().min(1).max(3)).required(),
    published_date: Joi.date(),
  }),
}

export async function handler(req: ValidatedRequest<typeof schema>): Promise<Decklist | undefined> {
  const user = (req as any).auth as { sub: string }
  console.log('Create decklist for user ' + user.sub)
  return await insertDecklist({ ...req.body, user_id: user.sub })
}
