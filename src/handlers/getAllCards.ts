import { getAllCards, getAllCardsInPacks } from '../gateways/storage/index'
import { Card, CardWithVersions } from '@5rdb/api'

export async function handler(): Promise<CardWithVersions[]> {
  const allCards: Card[] = await getAllCards()
  const allCardsWithVersions: CardWithVersions[] = allCards.map((card) => ({
    ...card,
    versions: [],
  }))

  const allCardsInPacks = await getAllCardsInPacks()
  allCardsInPacks.forEach((cardInPack) =>
    allCardsWithVersions
      .find((card) => card.id === cardInPack.card_id)
      ?.versions.push({ ...cardInPack })
  )
  return allCardsWithVersions
}
