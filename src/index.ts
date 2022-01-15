import 'source-map-support/register'

import createApp from './app'
import { createBot } from './bot'
import env from './env'
import { Service } from './typings/Service'

const noBot: Service = {
  async run() {
    console.log('BOT: skip')
  },
  async shutdown() {
    console.log('BOT: skip shutdown')
  },
}

Promise.all([createApp(), env.discord.isBotEnabled ? createBot(env.discord) : noBot]).then(
  ([app, bot]) => {
    app.run()
    bot.run()

    const shutdown = () => {
      app.shutdown()
      bot.shutdown()
      process.exit(0)
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
    process.on('SIGQUIT', shutdown)
  }
)
