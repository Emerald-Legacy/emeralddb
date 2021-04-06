import forge, { Middleware } from 'mappersmith'
import EncodeJson from 'mappersmith/middleware/encode-json'
import GlobalErrorHandler, { setErrorHandler } from 'mappersmith/middleware/global-error-handler'
import { getToken, unsetToken } from './utils/auth'

setErrorHandler((response) => {
  if (response.status() === 401) {
    unsetToken()
  }
  return false
})

const BearerToken: Middleware = () => ({
  prepareRequest(next) {
    return next().then((request) => {
      const bearerToken = getToken()
      return bearerToken == null
        ? request
        : request.enhance({ headers: { Authorization: `Bearer ${bearerToken}` } })
    })
  },
})

export const api = forge({
  clientId: '5rdb-client',
  middleware: [BearerToken, EncodeJson, GlobalErrorHandler],
  host: '/api',
  resources: {
    Card: {
      findAll: { method: 'GET', path: '/cards' },
      find: { method: 'GET', path: '/cards/{cardId}'}
    },
  },
})
