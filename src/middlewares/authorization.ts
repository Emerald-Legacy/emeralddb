import * as express from 'express'
import { expressjwt as jwt } from 'express-jwt'
import jwks from 'jwks-rsa'
import { getOrInsertDBUser } from '../gateways/storage'
import env from '../env'

export interface Auth0User {
  iss: string
  sub: string
  aud: string[]
  iat: number
  exp: number
  azp: string
  scope: string
}

const RULES_ADMIN = 'rules_admin'
const DATA_ADMIN = 'data_admin'

export const authorizedOnly = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${env.auth0Domain}/.well-known/jwks.json`,
  }),
  audience: 'http://fiveringsdb.com',
  issuer: `https://${env.auth0Domain}/`,
  algorithms: ['RS256'],
})

export async function rulesAdminOnly(req: express.Request, res: express.Response): Promise<void> {
  const user: Auth0User = (req as any).auth as Auth0User
  if (!user?.sub) {
    res.status(401).send()
  }
  const dbUser = await getOrInsertDBUser(user.sub)
  if (!dbUser.roles.includes(RULES_ADMIN)) {
    res.status(401).send()
  }
}

export async function dataAdminOnly(req: express.Request, res: express.Response): Promise<void> {
  const user: Auth0User = (req as any).auth as Auth0User
  if (!user?.sub) {
    res.status(401).send()
  }
  const dbUser = await getOrInsertDBUser(user.sub)
  if (!dbUser.roles.includes(DATA_ADMIN)) {
    res.status(401).send()
  }
}
