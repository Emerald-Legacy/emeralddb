import { createMapersmithHook } from '../utils/createMappersmithHook'
import { Cycles$findAll } from '@5rdb/api'
import { publicApi } from '../api'

export const usePacks = createMapersmithHook<Cycles$findAll['response']>(publicApi.Cycle.findAll)
