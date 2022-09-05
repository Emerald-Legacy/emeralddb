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
    Deck: {
      findForUser: { method: 'POST', path: '/decks' },
      find: { method: 'GET', path: '/decks/{deckId}' },
    },
    Decklist: {
      find: { method: 'GET', path: '/decklists/{decklistId}' },
      findPublished: { method: 'GET', path: '/decklists' },
      findComments: { method: 'GET', path: '/decklists/{decklistId}/comments' },
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
    Beta: {
      url: { method: 'GET', path: '/beta-url' },
    },
    User: {
      current: { method: 'GET', path: '/users/me' },
      update: { method: 'PUT', path: '/users/me' },
    },
    Card: {
      update: { method: 'POST', path: '/cards/{cardId}' },
      create: { method: 'PUT', path: '/cards' },
      delete: { method: 'DELETE', path: '/cards/{cardId}' },
      rename: { method: 'POST', path: '/cards/{cardId}/rename' },
    },
    Ruling: {
      create: { method: 'PUT', path: '/rulings' },
      update: { method: 'POST', path: '/rulings/{rulingId}' },
      delete: { method: 'DELETE', path: '/rulings/{rulingId}' },
    },
    Decklist: {
      create: { method: 'PUT', path: '/decklists' },
      publish: { method: 'POST', path: '/decklists/{decklistId}/publish' },
      unpublish: { method: 'POST', path: '/decklists/{decklistId}/unpublish' },
      delete: { method: 'DELETE', path: '/decklists/{decklistId}' },
    },
    Deck: {
      create: { method: 'PUT', path: '/decks' },
      delete: { method: 'DELETE', path: '/decks/{deckId}' },
    },
    Pack: {
      create: { method: 'PUT', path: '/packs' },
      import: { method: 'PUT', path: '/packs/import' },
      rotate: { method: 'PUT', path: '/packs/rotate/{packId}' },
    },
    Cycle: {
      create: { method: 'PUT', path: '/cycles' },
      rotate: { method: 'PUT', path: '/cycles/rotate/{cycleId}' },
    },
    CardInPack: {
      update: { method: 'POST', path: '/cards-in-packs' },
    },
    Comment: {
      create: { method: 'PUT', path: '/comments' },
      update: { method: 'POST', path: '/comments/{id}' },
      delete: { method: 'DELETE', path: '/comments/{id}' },
    },
  },
})
