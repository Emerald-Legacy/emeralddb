import { deleteCardInPack } from '../gateways/storage/index'
import * as Express from 'express'
import Joi from 'joi'
import { ValidatedRequest } from '../middlewares/validator'
import { CardInPacks$delete, CardInPack } from '@5rdb/api'

export const schema = {
  body: Joi.object<CardInPacks$delete['request']['body']>({
    cardInPack: Joi.object<CardInPack>(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema>,
  res: Express.Response
): Promise<void> {
  const cardInPack: CardInPack = req.body.cardInPack
  await deleteCardInPack(cardInPack.card_id, cardInPack.pack_id)
  res.sendStatus(200)
}
