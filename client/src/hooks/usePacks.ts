import { createApiHook } from '../utils/createApiHook'
import { Packs$findAll } from '@5rdb/api'
import { publicApi } from '../api'

export const usePacks = createApiHook<Packs$findAll['response']>(publicApi.Pack.findAll)
