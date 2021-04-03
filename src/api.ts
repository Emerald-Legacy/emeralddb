import { AsyncRouter, AsyncRouterInstance } from 'express-async-router'
import passport from 'passport'
import * as express from 'express'
import { importAllCardsInDirectory } from './handlers/importCardHandler'

import { authenticate, onlyAdmin, withBearerToken } from './middlewares/authorization'
import * as getAllCards from './handlers/getAllCards'

export default (): AsyncRouterInstance => {
  const api = AsyncRouter()

  api.get('/auth', passport.authenticate('oauth2', { session: false }))
  api.get(
    '/auth/callback',
    passport.authenticate('oauth2', { session: false }),
    function (req: express.Request, res: express.Response) {
      if (!req.user) {
        return res.status(400).send()
      }

      // res.redirect(303, `/?token=${req.user.jwt}`)
    }
  )
  api.get('/test', importAllCardsInDirectory)
  api.get('/cards', getAllCards.handler)
  return api
}
