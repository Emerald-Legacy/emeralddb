import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

export interface Config {
  botToken: string
  clientId: string
}

export interface Command {
  name: string
  command: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  handler(interaction: CommandInteraction): Promise<void>
}
