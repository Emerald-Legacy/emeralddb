import { createApiHook } from '../utils/createApiHook'
import { Decklists$find } from '@5rdb/api'
import { publicApi } from '../api'

export const useDecklist = createApiHook<Decklists$find['response'], string>(
  publicApi.Decklist.find,
  (decklistId) => ({ decklistId })
)
