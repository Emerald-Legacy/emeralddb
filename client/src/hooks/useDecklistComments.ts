import { createMapersmithHook } from '../utils/createMappersmithHook'
import { DecklistComments$findForDecklist } from '@5rdb/api'
import { publicApi } from '../api'

export const useDecklistComments = createMapersmithHook<
  DecklistComments$findForDecklist['response'],
  string
>(publicApi.Decklist.findComments, (decklistId) => ({ decklistId }))
