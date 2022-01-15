import { REST } from '@discordjs/rest'
import { Client, Intents } from 'discord.js'
import { Routes } from 'discord-api-types/v9'

import { Service } from '../../typings/Service'
import { command as cardCommand } from './commands/card'
import { Config } from './types'

export async function createBot(config: Config): Promise<Service> {
  console.log('BOT: registering commands')
  await registerCommands(config)

  console.log('BOT: initializing bot')
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return

    switch (interaction.commandName) {
      case cardCommand.name:
        return cardCommand.handler(interaction)
    }
  })

  return {
    async run() {
  await client.login(config.botToken)
      console.log('BOT: running')
    },
    async shutdown() {
      console.log('BOT: shutdown start')
      client.destroy()
      console.log('BOT: shutdown done')
    },
  }
}

async function registerCommands(config: Config): Promise<unknown> {
  const rest = new REST({ version: '9' }).setToken(config.botToken)
  const body = [cardCommand.command].map((command) => command.toJSON())
  return rest.put(Routes.applicationCommands(config.clientId), { body })
}
