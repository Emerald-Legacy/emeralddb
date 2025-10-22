import { createApiHook } from '../utils/createApiHook'
import { Cards$find } from '@5rdb/api'
import { publicApi } from '../api'

export const useCard = createApiHook<Cards$find['response'], string>(
  publicApi.Card.find,
  (cardId) => ({ cardId })
)
