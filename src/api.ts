import { AsyncRouter, AsyncRouterInstance } from 'express-async-router'
import * as getAllCards from './handlers/getAllCards'
import * as getAllPacks from './handlers/getAllPacks'
import * as createPack from './handlers/createPack'
import * as getAllCycles from './handlers/getAllCycles'
import * as createCycle from './handlers/createCycle'
import * as getAllTraits from './handlers/getAllTraits'
import * as getDeck from './handlers/getDeck'
import * as getAllDecksForUser from './handlers/getAllDecksForUser'
import * as createDeck from './handlers/createDeck'
import * as getAllPublishedDecklists from './handlers/getAllPublishedDecklists'
import * as getDecklist from './handlers/getDecklist'
import * as publishDecklist from './handlers/publishDecklist'
import * as unpublishDecklist from './handlers/unpublishDecklist'
import * as validateDecklist from './handlers/validateDecklist'
import * as createDecklist from './handlers/createDecklist'
import * as getCardDetails from './handlers/getCardDetails'
import * as updateCard from './handlers/updateCard'
import * as renameCard from './handlers/renameCard'
import * as deleteCard from './handlers/deleteCard'
import * as createCard from './handlers/createCard'
import * as updateRuling from './handlers/updateRuling'
import * as createRuling from './handlers/createRuling'
import * as deleteDeck from './handlers/deleteDeck'
import * as deleteDecklist from './handlers/deleteDecklist'
import * as deleteRuling from './handlers/deleteRuling'
import * as importData from './handlers/importData'
import * as getCurrentUser from './handlers/getCurrentUser'
import * as updateUser from './handlers/updateUser'
import * as updateCardsInPack from './handlers/updateCardsInPack'
import * as createDecklistComment from './handlers/createDecklistComment'
import * as updateDecklistComment from './handlers/updateDecklistComment'
import * as deleteDecklistComment from './handlers/deleteDecklistComment'
import * as getAllCommentsForDecklist from './handlers/getAllCommentsForDecklist'
import { authorizedOnly, dataAdminOnly, rulesAdminOnly } from './middlewares/authorization'
import env from './env'

export default (): AsyncRouterInstance => {
  const api = AsyncRouter()
  api.get('/cards', getAllCards.handler)
  api.get('/cards/:cardId', getCardDetails.handler)
  api.post('/cards/:cardId', authorizedOnly, dataAdminOnly, updateCard.handler)
  api.delete('/cards/:cardId', authorizedOnly, dataAdminOnly, deleteCard.handler)
  api.post('/cards/:cardId/rename', authorizedOnly, dataAdminOnly, renameCard.handler)
  api.put('/cards', authorizedOnly, dataAdminOnly, createCard.handler)
  api.get('/packs', getAllPacks.handler)
  api.put('/packs', authorizedOnly, dataAdminOnly, createPack.handler)
  api.post('/cards-in-packs', authorizedOnly, dataAdminOnly, updateCardsInPack.handler)
  api.get('/cycles', getAllCycles.handler)
  api.put('/cycles', authorizedOnly, dataAdminOnly, createCycle.handler)
  api.get('/traits', getAllTraits.handler)
  api.get('/users/me', authorizedOnly, getCurrentUser.handler)
  api.put('/users/me', authorizedOnly, updateUser.handler)
  api.get('/import', authorizedOnly, dataAdminOnly, importData.handler)
  api.get('/decks/:deckId', getDeck.handler)
  api.post('/decks', getAllDecksForUser.handler)
  api.put('/decks', authorizedOnly, createDeck.handler)
  api.delete('/decks/:deckId', authorizedOnly, deleteDeck.handler)
  api.get('/decklists', getAllPublishedDecklists.handler)
  api.get('/decklists/:decklistId', getDecklist.handler)
  api.post('/decklists/:decklistId/publish', authorizedOnly, publishDecklist.handler)
  api.post('/decklists/:decklistId/unpublish', authorizedOnly, unpublishDecklist.handler)
  api.post('/decklists/validate', validateDecklist.handler)
  api.delete('/decklists/:decklistId', authorizedOnly, deleteDecklist.handler)
  api.put('/decklists', authorizedOnly, createDecklist.handler)
  api.put('/rulings', authorizedOnly, rulesAdminOnly, createRuling.handler)
  api.post('/rulings/:rulingId', authorizedOnly, rulesAdminOnly, updateRuling.handler)
  api.delete('/rulings/:rulingId', authorizedOnly, rulesAdminOnly, deleteRuling.handler)
  api.get('/decklists/:decklistId/comments', getAllCommentsForDecklist.handler)
  api.put('/comments', authorizedOnly, createDecklistComment.handler)
  api.post('/comments/:id', authorizedOnly, updateDecklistComment.handler)
  api.delete('/comments/:id', authorizedOnly, deleteDecklistComment.handler)
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
