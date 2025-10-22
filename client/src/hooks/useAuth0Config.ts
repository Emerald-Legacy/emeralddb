import { publicApi } from '../api'
import { createApiHook } from '../utils/createApiHook'

export const useAuth0Config = createApiHook<{ clientId: string; domain: string }>(
  publicApi.Auth0.get
)
