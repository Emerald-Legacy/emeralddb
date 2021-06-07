import { AsyncRouter, AsyncRouterInstance } from 'express-async-router'
import * as getAllCards from './handlers/getAllCards'
import * as getAllPacks from './handlers/getAllPacks'
import * as getAllCycles from './handlers/getAllCycles'
import * as getAllTraits from './handlers/getAllTraits'
import * as getCardDetails from './handlers/getCardDetails'
import * as updateCard from './handlers/updateCard'
import * as createCard from './handlers/createCard'
import * as updateRuling from './handlers/updateRuling'
import * as createRuling from './handlers/createRuling'
import * as deleteRuling from './handlers/deleteRuling'
import * as importData from './handlers/importData'
import * as getCurrentUser from './handlers/getCurrentUser'
import * as updateUser from './handlers/updateUser'
import { authorizedOnly, dataAdminOnly, rulesAdminOnly } from './middlewares/authorization'
import env from './env'

export default (): AsyncRouterInstance => {
  const api = AsyncRouter()
  api.get('/cards', getAllCards.handler)
  api.get('/cards/:cardId', getCardDetails.handler)
  api.post('/cards/:cardId', authorizedOnly, dataAdminOnly, updateCard.handler)
  api.put('/cards', authorizedOnly, dataAdminOnly, createCard.handler)
  api.get('/packs', getAllPacks.handler)
  api.get('/cycles', getAllCycles.handler)
  api.get('/traits', getAllTraits.handler)
  api.get('/users/me', authorizedOnly, getCurrentUser.handler)
  api.put('/users/me', authorizedOnly, updateUser.handler)
  api.get('/import', authorizedOnly, dataAdminOnly, importData.handler)
  api.put('/rulings', authorizedOnly, rulesAdminOnly, createRuling.handler)
  api.post('/rulings/:rulingId', authorizedOnly, rulesAdminOnly, updateRuling.handler)
  api.delete('/rulings/:rulingId', authorizedOnly, rulesAdminOnly, deleteRuling.handler)
  api.get(
    '/auth0',
    (): {
      domain: string
      clientId: string
    } => {
      return {
        domain: env.auth0Domain,
        clientId: env.auth0ClientId,
      }
    }
  )
  return api
}
