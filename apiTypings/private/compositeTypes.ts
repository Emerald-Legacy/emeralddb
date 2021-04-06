import { Card, CardInPack, Ruling } from './baseTypes'

export type CardWithVersions = Card & {
  versions: Omit<CardInPack, 'card_id'>[]
}

export type CardWithDetails = CardWithVersions & {
  rulings: Omit<Ruling, 'card_id'>[]
}
