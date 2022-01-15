import { fetchValidCache } from './cardCache'
import { CachedCard } from './types'

type NoMatch = { __tag: 'noMatch' }
type SingleMatch = { __tag: 'singleMatch'; card: CachedCard }
type MultiMatch = { __tag: 'multiMatch'; names: string[] }

export async function search(query: string): Promise<NoMatch | SingleMatch | MultiMatch> {
  const validCache = await fetchValidCache()
  const results = validCache.fuzzy.search(query, { limit: 3 })
  const [first, second] = results
  if (!first) {
    return { __tag: 'noMatch' }
  }

  const matchedSingleItem = !second
  const firstMatch50pctBetterThanSecond = (first.score ?? 0) * 1.5 <= (second.score ?? 0)
  if (matchedSingleItem || firstMatch50pctBetterThanSecond) {
    const card = validCache.registry.get(first.item)
    return !card ? { __tag: 'noMatch' } : { __tag: 'singleMatch', card }
  }

  // Multiple options
  const possibleMatches = results.map((res) => res.item)
  return { __tag: 'multiMatch', names: possibleMatches }
}
