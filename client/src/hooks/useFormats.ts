import { createApiHook } from '../utils/createApiHook'
import { Formats$findAll } from '@5rdb/api'
import { publicApi } from '../api'

export const useFormats = createApiHook<Formats$findAll['response']>(publicApi.Format.findAll)
