import { AsyncRouter, AsyncRouterInstance } from 'express-async-router'
import * as getAllCards from './handlers/getAllCards'
import * as getCardDetails from './handlers/getCardDetails'
import * as importData from './handlers/importData'
import * as getCurrentUser from './handlers/getCurrentUser'
import { authorizedOnly, dataAdminOnly } from './middlewares/authorization'
import env from './env'

export default (): AsyncRouterInstance => {
  const api = AsyncRouter()
  api.get('/import', authorizedOnly, dataAdminOnly, importData.handler)
  api.get('/cards', getAllCards.handler)
  api.get('/cards/:cardId', getCardDetails.handler)
  api.get('/users/me', authorizedOnly, getCurrentUser.handler)
  api.get('/auth0', (): {
    domain: string
    clientId: string
  } => {
    return {
      domain: env.auth0Domain,
      clientId: env.auth0ClientId,
    }
  })
  return api
}
