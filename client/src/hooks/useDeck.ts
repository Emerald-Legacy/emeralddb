import { createApiHook } from '../utils/createApiHook'
import { Decks$find } from '@5rdb/api'
import { publicApi } from '../api'

export const useDeck = createApiHook<Decks$find['response'], string>(
  publicApi.Deck.find,
  (deckId) => ({ deckId })
)
