import { createApiHook } from '../utils/createApiHook'
import { DecklistComments$findForDecklist } from '@5rdb/api'
import { publicApi } from '../api'

export const useDecklistComments = createApiHook<
  DecklistComments$findForDecklist['response'],
  string
>(publicApi.Decklist.findComments, (decklistId) => ({ decklistId }))
