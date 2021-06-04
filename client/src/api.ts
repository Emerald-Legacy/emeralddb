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

export const publicApi = forge({
  clientId: '5rdb-client',
  middleware: [EncodeJson, GlobalErrorHandler],
  host: '/api',
  resources: {
    Card: {
      findAll: { method: 'GET', path: '/cards' },
      find: { method: 'GET', path: '/cards/{cardId}' },
    },
    Pack: {
      findAll: { method: 'GET', path: '/packs' },
    },
    Cycle: {
      findAll: { method: 'GET', path: '/cycles' },
    },
    Trait: {
      findAll: { method: 'GET', path: '/traits' },
    },
    Auth0: {
      get: { method: 'GET', path: '/auth0' },
    },
  },
})

export const privateApi = forge({
  clientId: '5rdb-client',
  middleware: [BearerToken, EncodeJson, GlobalErrorHandler],
  host: '/api',
  resources: {
    Data: {
      import: { method: 'GET', path: '/import' },
    },
    User: {
      current: { method: 'GET', path: '/users/me' },
      update: { method: 'PUT', path: '/users/me' },
    },
    Card: {
      update: { method: 'POST', path: 'cards/{cardId}/update'},
      create: { method: 'PUT', path: 'cards/create/new'}
    }
  },
})
