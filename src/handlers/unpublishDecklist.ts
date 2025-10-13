import { getDecklist, unpublishDecklist } from '../gateways/storage/index'
import Joi from 'joi'
import { Response } from 'express'
import { ValidatedRequest } from '../middlewares/validator'
import { Decklist, Decklists$publish } from '@5rdb/api'

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
  const user = (req as any).auth as { sub: string }
  if (user.sub !== decklist.user_id) {
    res.sendStatus(403)
    return
  }
  console.log(`Unpublish decklist ${decklist.id} for user ${user.sub}!`)
  return await unpublishDecklist(req.params.decklistId)
}
