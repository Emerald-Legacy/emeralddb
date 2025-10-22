import { createApiHook } from '../utils/createApiHook'
import { Cycles$findAll } from '@5rdb/api'
import { publicApi } from '../api'

export const usePacks = createApiHook<Cycles$findAll['response']>(publicApi.Cycle.findAll)
