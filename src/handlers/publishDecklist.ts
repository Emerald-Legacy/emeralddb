import { getDecklist, publishDecklist } from '../gateways/storage/index'
import Joi from 'joi'
import { Response } from 'express'
import { ValidatedRequest } from '../middlewares/validator'
import { Decklist, Decklists$publish } from '@5rdb/api'
import { isDeckValid } from './validators/deckValidator'

export const schema = {
  body: Joi.object<Decklists$publish['request']['params']>({
    decklistId: Joi.string().required(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema>,
  res: Response
): Promise<Decklist | undefined> {
  const decklist = await getDecklist(req.params.decklistId)
  if (!decklist) {
    res.sendStatus(404)
    return
  }
  const user = req.user as { sub: string }
  if (user.sub !== decklist.user_id) {
    res.sendStatus(403)
    return
  }
  const { valid } = await isDeckValid(decklist.cards, decklist.format)
  if (!valid) {
    res.status(400).send('Deck has validation errors')
  } else {
    console.log(`Publish decklist ${decklist.id} for user ${user.sub}!`)
    return await publishDecklist(req.params.decklistId)
  }
}
