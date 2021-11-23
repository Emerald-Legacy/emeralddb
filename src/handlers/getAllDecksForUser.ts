import { getDecksForUser } from '../gateways/storage/index'
import { Request } from 'express'
import { DeckWithVersions, Decks$findForUser } from '@5rdb/api'
import { addDecklistsToDeck } from './getDeck'

export async function handler(
  req: Request<Decks$findForUser['request']['body']>
): Promise<DeckWithVersions[] | undefined> {
  const decks = await getDecksForUser(req.body.userId)
  return await Promise.all(decks.map(async (deck) => await addDecklistsToDeck(deck)))
}
