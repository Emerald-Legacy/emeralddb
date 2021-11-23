import { createMapersmithHook } from '../utils/createMappersmithHook'
import { Packs$findAll } from '@5rdb/api'
import { publicApi } from '../api'

export const usePacks = createMapersmithHook<Packs$findAll['response']>(publicApi.Pack.findAll)
