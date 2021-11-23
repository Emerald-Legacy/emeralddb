import { createMapersmithHook } from '../utils/createMappersmithHook'
import { Decklists$find } from '@5rdb/api'
import { publicApi } from '../api'

export const useDecklist = createMapersmithHook<Decklists$find['response'], string>(
  publicApi.Decklist.find,
  (decklistId) => ({ decklistId })
)
