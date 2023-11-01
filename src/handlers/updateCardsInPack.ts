import { insertOrUpdateCardInPack } from "../gateways/storage"
import * as Express from 'express'
import Joi from 'joi'
import { ValidatedRequest } from '../middlewares/validator'
import { CardInPacks$updateAll, CardInPack } from '@5rdb/api'

export const schema = {
  body: Joi.object<CardInPacks$updateAll['request']['body']>({
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
