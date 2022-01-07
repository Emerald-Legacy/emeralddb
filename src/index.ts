import 'source-map-support/register'

import createApp from './app'
import { startBot } from './bot'
import env from './env'

createApp().then(({ run }) => {
  if (env.discord.isBotEnabled) {
    startBot(env.discord) // This is async, but we don't need to wait for it
  }

  run()
})
