import { createMapersmithHook } from '../utils/createMappersmithHook'
import { Cards$find } from '@5rdb/api'
import { api } from '../api'

export const useCard = createMapersmithHook<Cards$find['response'], string>(api.Card.find, (cardId) => ({ cardId }))