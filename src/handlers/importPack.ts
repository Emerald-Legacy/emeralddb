import {
  insertOrUpdateCard,
  insertOrUpdateCardInPack,
  insertOrUpdatePack,
} from '../gateways/storage/index'
import { Pack, Pack$import } from '@5rdb/api'
import Joi from 'joi'
import { ValidatedRequest } from '../middlewares/validator'
import * as Express from 'express'

export const schema = {
  body: Joi.object<Pack$import['request']['body']>({
    pack: Joi.object<Pack>().required(),
    cards: Joi.array().required(),
    cardsInPack: Joi.array().required(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema>,
  res: Express.Response
): Promise<Pack | undefined> {
  if (!req.body?.pack?.name) {
    res.status(400).send()
    return
  }
  console.log(`Import pack ${req.body.pack.name}...`)
  await insertOrUpdatePack(req.body.pack)
  await Promise.all(req.body.cards.map(async (card) => await insertOrUpdateCard(card)))
  await Promise.all(
    req.body.cardsInPack.map(async (cardInPack) => await insertOrUpdateCardInPack(cardInPack))
  )
  console.log(`Successfully imported pack ${req.body.pack.name}`)
  return req.body.pack
}
