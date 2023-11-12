import { createMapersmithHook } from '../utils/createMappersmithHook'
import { Formats$findAll } from '@5rdb/api'
import { publicApi } from '../api'

export const useFormats = createMapersmithHook<Formats$findAll['response']>(publicApi.Format.findAll)
