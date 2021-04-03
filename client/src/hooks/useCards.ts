import { createMapersmithHook } from '../utils/createMappersmithHook'
import { Cards$findAll, Card } from '@5rdb/api'
import { api } from '../api'

export const useCards = createMapersmithHook<Cards$findAll['response']>(api.Card.findAll)