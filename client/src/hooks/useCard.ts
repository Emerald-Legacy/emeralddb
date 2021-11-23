import { createMapersmithHook } from '../utils/createMappersmithHook'
import { Cards$find } from '@5rdb/api'
import { publicApi } from '../api'

export const useCard = createMapersmithHook<Cards$find['response'], string>(
  publicApi.Card.find,
  (cardId) => ({ cardId })
)
