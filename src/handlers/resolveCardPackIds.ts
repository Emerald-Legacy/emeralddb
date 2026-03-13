import { getAllFormats, getAllCardsInPacks } from '../gateways/storage/index'

export async function resolveCardPackIds(
  cardIds: string[],
  formatId: string
): Promise<Record<string, string>> {
  const formats = await getAllFormats()
  const format = formats.find((f) => f.id === formatId)
  if (!format || !format.legal_packs) {
    return {}
  }

  const legalPacks = new Set(format.legal_packs)
  const allCardsInPacks = await getAllCardsInPacks()

  const versionsByCard = new Map<string, string[]>()
  for (const cip of allCardsInPacks) {
    if (!cip.rotated && legalPacks.has(cip.pack_id)) {
      let packs = versionsByCard.get(cip.card_id)
      if (!packs) {
        packs = []
        versionsByCard.set(cip.card_id, packs)
      }
      packs.push(cip.pack_id)
    }
  }

  const result: Record<string, string> = {}
  for (const cardId of cardIds) {
    const packs = versionsByCard.get(cardId)
    if (packs && packs.length > 0) {
      result[cardId] = packs[0]
    }
  }

  return result
}
