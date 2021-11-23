import { createMapersmithHook } from '../utils/createMappersmithHook'
import { Cards$findAll } from '@5rdb/api'
import { publicApi } from '../api'

export const useCards = createMapersmithHook<Cards$findAll['response']>(publicApi.Card.findAll)
