import { publicApi } from '../api'
import { createMapersmithHook } from '../utils/createMappersmithHook'

export const useAuth0Config = createMapersmithHook<{ clientId: string; domain: string }>(
  publicApi.Auth0.get
)
