import { createMapersmithHook } from '../utils/createMappersmithHook'
import { Decks$find } from '@5rdb/api'
import { publicApi } from '../api'

export const useDeck = createMapersmithHook<Decks$find['response'], string>(
  publicApi.Deck.find,
  (deckId) => ({ deckId })
)
