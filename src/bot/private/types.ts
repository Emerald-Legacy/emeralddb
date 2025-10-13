import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

export interface Config {
  botToken: string
  clientId: string
}

export interface Command {
  name: string
  command: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  handler(interaction: CommandInteraction): Promise<any>
}

export interface CardInput {
  id: string
  name: string
  name_extra?: string
}

export interface CardPackInput {
  card_id: string
  image_url?: string
}

export interface RulingInput {
  id: number
  text: string
  source: string
  link: string
}

export interface CachedCard {
  image: string
  id: string
  name: string
}
