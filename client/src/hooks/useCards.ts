import { createApiHook } from '../utils/createApiHook'
import { Cards$findAll } from '@5rdb/api'
import { publicApi } from '../api'

export const useCards = createApiHook<Cards$findAll['response']>(publicApi.Card.findAll)
