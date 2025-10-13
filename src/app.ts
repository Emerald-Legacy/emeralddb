import cors from 'cors'
import express, { Request, Response } from 'express'
import helmet from 'helmet'
import { Server } from 'http'
import path from 'path'

import env from './env'
import api from './api'
import { Service } from './typings/Service'

export default async (): Promise<Service> => {
  console.log('SERVER: initializing')
  const app = express()

  app.use(helmet({ contentSecurityPolicy: false }))
  app.use(express.json({ limit: '200mb' }))
  app.use(express.urlencoded({ extended: true }))

  app.use(cors())
  app.use('/api', api())
  app.use(express.static(path.resolve(__dirname, 'public')))
  app.get('/*', function (req: Request, res: Response) {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
  })

  let server: Server | undefined
  return {
    async run() {
      server = app.listen(env.serverPort, () => {
        console.log(`SERVER: ready. Listening at http://localhost:${env.serverPort}`)
      })
    },
    async shutdown() {
      console.log('SERVER: shutdown start')
      if (server) {
        await asyncCloseServer(server)
        console.log('SERVER: shutdown done')
      }
    },
  }
}

async function asyncCloseServer(server: Server) {
  return new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}
