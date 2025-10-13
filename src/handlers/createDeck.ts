import { insertDeck, getDecklist, insertDecklist } from '../gateways/storage'
import Joi from 'joi'
import { ValidatedRequest } from '../middlewares/validator'
import { Deck, Decks$create } from '@5rdb/api'

export const schema = {
  body: Joi.object<Decks$create['request']['body']>({
    forkedFrom: Joi.string().optional(),
  }),
}

export async function handler(req: ValidatedRequest<typeof schema>): Promise<Deck | undefined> {
  const user = (req as any).auth as { sub: string }
  console.log('Create deck for user ' + user.sub)
  const deck = await insertDeck({ user_id: user.sub, forked_from: req.body?.forkedFrom })
  if (req.body?.forkedFrom) {
    const decklist = await getDecklist(req.body?.forkedFrom)
    if (decklist) {
      await insertDecklist({
        deck_id: deck.id,
        format: decklist.format,
        name: 'Copy of ' + decklist.name,
        primary_clan: decklist.primary_clan,
        secondary_clan: decklist.secondary_clan,
        description: 'Original description: ' + decklist.description,
        version_number: '0.1',
        cards: decklist.cards,
        published_date: undefined,
        user_id: user.sub,
      })
    }
  }
  return deck
}
