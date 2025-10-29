import {
  getDeck,
  getAllDecklistsForDeck,
  getDecklist,
  getCards,
} from '../gateways/storage/index'
import { Request, Response } from 'express'
import {
  Deck,
  Decklist,
  Decks$find,
  DeckWithVersions,
  DecklistWithExtraInfo,
} from '@5rdb/api'

export async function handler(
  req: Request<Decks$find['request']['params']>,
  res: Response<Decks$find['response']>
): Promise<DeckWithVersions | undefined> {
  const deck = await getDeck(req.params.deckId)
  if (!deck) {
    res.sendStatus(404)
    return
  }
  return await addDecklistsToDeck(deck)
}

async function addExtraInfoToDecklist(decklist: Decklist): Promise<DecklistWithExtraInfo> {
  const cardIds = Object.keys(decklist.cards)
  const cards = await getCards(cardIds)
  const stronghold = cards.find((card) => card.type === 'stronghold')
  const role = cards.find((card) => card.type === 'role')

  return {
    ...decklist,
    stronghold,
    role,
  }
}

export async function addDecklistsToDeck(deck: Deck): Promise<DeckWithVersions> {
  const decklists = await getAllDecklistsForDeck(deck.id)
  const forkedFrom = await getDecklist(deck.forked_from || '')
  const decklistsWithExtraInfo = await Promise.all(decklists.map(addExtraInfoToDecklist))
  return {
    ...deck,
    versions: decklistsWithExtraInfo,
    forkedFrom: forkedFrom,
  }
}
