import { insertOrUpdateCardInPack } from '../gateways/storage'
import * as Express from 'express'
import Joi from 'joi'
import { ValidatedRequest } from '../middlewares/validator'
import { CardInPacks$insertOrUpdate, CardInPack } from '@5rdb/api'

export const schema = {
  body: Joi.object<CardInPacks$insertOrUpdate['request']['body']>({
    cardInPack: Joi.object<CardInPack>(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema>,
  res: Express.Response
): Promise<void> {
  const cardInPack: CardInPack = req.body.cardInPack
  await insertOrUpdateCardInPack(cardInPack)
  res.sendStatus(200)
}
