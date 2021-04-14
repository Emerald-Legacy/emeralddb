import { createMapersmithHook } from '../utils/createMappersmithHook'
import { Users$me } from '@5rdb/api'
import { privateApi } from '../api'

export const useCurrentUser = createMapersmithHook<Users$me['response']>(privateApi.User.current)