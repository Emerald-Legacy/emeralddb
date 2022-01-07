import { DiscordAPIError } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { search } from '../cardsFuzzySearch'
import { Command } from '../types'

const list = new Intl.ListFormat('en', { style: 'long', type: 'disjunction' })

const name = 'card'

export const command: Command = {
  name,
  command: new SlashCommandBuilder()
    .setName(name)
    .setDescription("Replies with the card you're looking for")
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('The name of the card or a part of its name')
        .setRequired(true)
    ),

  async handler(interaction) {
    const query = interaction.options.getString('name')
    if (!query) return

    const result = await search(query)
    try {
      if (result.__tag === 'noMatch') {
        return interaction.reply({
          ephemeral: true,
          content: `I am sorry, but I have no idea what you are looking for`,
        })
      }
      if (result.__tag === 'singleMatch') {
        return interaction.reply(result.image)
      }
      const candidates = result.names.map((name) => `\`${name}\``)
      return interaction.reply({
        ephemeral: true,
        content: `I'm not sure I follow you. Maybe you're looking for ${list.format(candidates)}?`,
      })
    } catch (e) {
      if (e instanceof DiscordAPIError) {
        return
      }
      throw e
    }
  },
}
