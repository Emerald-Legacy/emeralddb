import { privateApi } from '../api'
import { createMapersmithHook } from '../utils/createMappersmithHook'

export const useBetaEnvironment = createMapersmithHook<{ betaUrl: string }>(privateApi.Beta.url)
