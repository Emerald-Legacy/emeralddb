import { privateApi } from '../api'
import { createApiHook } from '../utils/createApiHook'

export const useBetaEnvironment = createApiHook<{ betaUrl: string }>(privateApi.Beta.url)
