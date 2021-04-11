import { createMapersmithHook } from '../utils/createMappersmithHook'
import { Users$me } from '@5rdb/api'
import { api } from '../api'

export const useCurrentUser = createMapersmithHook<Users$me['response']>(api.User.current)