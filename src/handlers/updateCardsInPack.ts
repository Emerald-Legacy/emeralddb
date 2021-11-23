import { insertOrUpdateCardInPack } from '../gateways/storage/index'
import * as Express from 'express'
import Joi from 'joi'
import { ValidatedRequest } from '../middlewares/validator'
import { CardInPacks$update, CardInPack } from '@5rdb/api'

export const schema = {
  body: Joi.object<CardInPacks$update['request']['body']>({
    cardsInPacks: Joi.array(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema>,
  res: Express.Response
): Promise<void> {
  const cardsInPacks: CardInPack[] = req.body.cardsInPacks
  cardsInPacks.forEach(async (cardInPack) => {
    await insertOrUpdateCardInPack(cardInPack)
  })
  res.sendStatus(200)
}
