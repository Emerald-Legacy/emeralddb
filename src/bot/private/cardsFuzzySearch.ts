import Fuse from 'fuse.js'
import { Card, CardInPack } from '@5rdb/api'
import { getAllCards, getAllCardsInPacks } from '../../gateways/storage'

type NoMatch = { __tag: 'noMatch' }
type SingleMatch = { __tag: 'singleMatch'; image: string }
type MultiMatch = { __tag: 'multiMatch'; names: string[] }

export async function search(query: string): Promise<NoMatch | SingleMatch | MultiMatch> {
  const validCache = await fetchValidCache()
  const results = validCache.fuzzy.search(query, { limit: 3 })
  const [first, second] = results
  if (!first) {
    return { __tag: 'noMatch' }
  }

  if (!second) {
    // Matched a single item
    const image = validCache.registry.get(first.item)
    return !image ? { __tag: 'noMatch' } : { __tag: 'singleMatch', image }
  }

  if ((first.score ?? 0) * 1.5 <= (second.score ?? 0)) {
    // First match is more than 50% better match than the second
    const image = validCache.registry.get(first.item)
    return !image ? { __tag: 'noMatch' } : { __tag: 'singleMatch', image }
  }

  // Multiple options
  const possibleMatches = results.map((res) => res.item)
  return { __tag: 'multiMatch', names: possibleMatches }
}

// ---------
// IN-MEMORY CACHE
// ---------
interface Cache {
  registry: Map<string, string>
  fuzzy: Fuse<string>
  expiresAt: number
}
const cache: Cache = {
  registry: new Map(),
  expiresAt: 0, // Initialize the cache as expired
  fuzzy: new Fuse<string>([], { isCaseSensitive: false, includeScore: true, ignoreLocation: true }),
}

async function fetchValidCache(): Promise<Cache> {
  if (cache.expiresAt > Date.now()) {
    return cache
  }

  cache.registry = await buildRegistry()
  cache.expiresAt = fiveMinutesFromNow()
  cache.fuzzy.setCollection(Array.from(cache.registry.keys()))

  return cache
}

const fiveMinutesFromNow = () => Date.now() + 1000 * 60 * 5

// ---------
// REGISTRY
// ---------
async function buildRegistry(): Promise<Map<string, string>> {
  const [cards, allCardsInPacks] = await Promise.all([getAllCards(), getAllCardsInPacks()])

  // Pre-group by ID to keep this function as O(2n) instead of O(n2)
  const images = new Map(allCardsInPacks.flatMap(idAndImageSkippingWhenImageIsMissing))

  return new Map(cards.flatMap(nameAndImageSkippingWhenImageIsMissing(images)))
}

const idAndImageSkippingWhenImageIsMissing = (card: CardInPack): [string, string][] => {
  if (typeof card.image_url !== 'string') {
    return []
  }
  return [[card.card_id, card.image_url]]
}

const nameAndImageSkippingWhenImageIsMissing =
  (images: Map<string, string>) =>
  (card: Card): [string, string][] => {
    const image = images.get(card.id)
    if (typeof image !== 'string') {
      return []
    }

    return [[extendedName(card), image]]
  }

const versionNumberRegex = /\((\d+)\)/ // Matches `(2)`, `(42)`, etc
const extendedName = (card: Card) => {
  if (!card.name_extra) {
    return card.name
  }

  const match = versionNumberRegex.exec(card.name_extra)
  if (match === null) {
    return `${card.name} - ${card.name_extra} `
  }

  const [, versionNumber] = match
  return `${card.name} ${versionNumber}`
}
