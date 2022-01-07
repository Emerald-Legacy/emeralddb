import { Client, Intents } from 'discord.js'

import { Config } from './types'
import { command as cardCommand } from './commands/card'

import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

export async function startBot(config: Config): Promise<void> {
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

  await client.login(config.botToken)
  console.log('BOT: done')
}

async function registerCommands(config: Config): Promise<unknown> {
  const rest = new REST({ version: '9' }).setToken(config.botToken)
  const body = [cardCommand.command].map((command) => command.toJSON())
  return rest.put(Routes.applicationCommands(config.clientId), { body })
}
