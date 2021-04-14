import { Cycle, Pack, User } from './baseTypes'
import { CardWithVersions, CardWithDetails } from './compositeTypes'

export interface Cards$findAll {
  response: CardWithVersions[]
}

export interface Cards$find {
  response: CardWithDetails
}

export interface Packs$findAll {
  response: Pack[]
}

export interface Cycles$findAll {
  response: Cycle[]
}

export interface Users$me {
  response: User
}

export interface Users$update {
  request: { body: { id: string; name: string } }
  response: User
}
