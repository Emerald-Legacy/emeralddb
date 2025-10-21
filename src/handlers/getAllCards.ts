import { getAllCards, getAllCardsInPacks } from '../gateways/storage/index'
import { Card, CardWithVersions } from '@5rdb/api'

export async function handler(): Promise<CardWithVersions[]> {
  const allCards: Card[] = await getAllCards()
  const allCardsWithVersions: CardWithVersions[] = allCards.map((card) => ({
    ...card,
    versions: [],
  }))

  // Create a Map for O(1) lookups instead of O(n) array.find()
  // This improves performance from O(n*m) to O(n+m) where n=cards in packs, m=total cards
  const cardMap = new Map(allCardsWithVersions.map((card) => [card.id, card]))

  const allCardsInPacks = await getAllCardsInPacks()
  allCardsInPacks.forEach((cardInPack) => {
    const card = cardMap.get(cardInPack.card_id)
    if (card) {
      card.versions.push({ ...cardInPack })
    }
  })

  return allCardsWithVersions
    .map((card) => {
      let text = card.text
      if (text) {
        text = text.replace(/<br\/>/g, '\n')
      }
      return {
        ...card,
        text: text,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}
