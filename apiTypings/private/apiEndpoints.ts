import { CardWithVersions, CardWithDetails } from './compositeTypes'

export interface Cards$findAll {
  response: CardWithVersions[]
}

export interface Cards$find {
  response: CardWithDetails
}
