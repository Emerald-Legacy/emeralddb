import { DiscordAPIError, MessageEmbedOptions, ColorResolvable } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getAllRulingsForCard } from '../../../gateways/storage'
import { search } from '../cardsFuzzySearch'
import { CachedCard, Command, RulingInput } from '../types'
import { listAlternatives } from '../format'

const name = 'rulings'

export const command: Command = {
  name,
  command: new SlashCommandBuilder()
    .setName(name)
    .setDescription("Replies with rulings for the card you're looking for")
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
      if (result.__tag === 'multiMatch') {
        const candidates = result.names.map((name) => `\`${name}\``)
        return interaction.reply({
          ephemeral: true,
          content: `I'm not sure I follow you. Are you looking for ${listAlternatives(
            candidates
          )}?`,
        })
      }

      const rulings = await getAllRulingsForCard(result.card.id)
      /**
       * We're sending each ruling as a separate reply using embeds.
       *
       * The embeds look nice and keep the replies clean, but each embed has a
       * char count limit, and a reply with multiple embed have yet another char
       * limit for the combioned embeds. That's why we put one embed per reply.
       *
       * Each interaction can get only one reply, but infinite `followUps`
       */
      const [firstEmbed, ...followUpEmbeds] = rulings.map(toEmbed(result.card))
      await interaction.reply({ embeds: [firstEmbed] })
      await Promise.all(followUpEmbeds.map((embed) => interaction.followUp({ embeds: [embed] })))
    } catch (e) {
      if (e instanceof DiscordAPIError) {
        return
      }
      throw e
    }
  },
}

/**
 *
 * @see https://discordjs.guide/popular-topics/embeds.html#embed-limits
 */
const toEmbed =
  (card: CachedCard) =>
  (ruling: RulingInput): MessageEmbedOptions => ({
    color: color(ruling),
    author: {
      name: truncate(256, card.name),
      url: `https://www.emeralddb.org/card/${card.id}`,
    },
    title: truncate(256, `Rulling #${ruling.id}`),
    url: ruling.link,
    thumbnail: {
      url: card.image,
    },
    description: truncate(4096, formatRulingText(ruling.text)),
    footer: {
      text: truncate(2048, ruling.source),
    },
  })

function color(ruling: RulingInput): ColorResolvable {
  switch (ruling.source) {
    case 'Developer ruling':
      return 'BLUE'
    default:
      return 'GREEN'
  }
}

const links = /\[([^\]]+)]\([^)]+\)/g // Matches `[some text](some link)` and captures `some text`
function formatRulingText(rawText: string): string {
  return rawText.replace(links, (_, text) => `\`${text}\``).trim()
}

function truncate(n: number, str: string): string {
  if (str.length <= n) {
    return str
  }
  const subString = str.substring(0, n - 1)
  return subString.substring(0, subString.lastIndexOf(' ')) + '…'
}
