import { createApiHook } from '../utils/createApiHook'
import { Users$me } from '@5rdb/api'
import { privateApi } from '../api'

export const useCurrentUser = createApiHook<Users$me['response']>(privateApi.User.current)
