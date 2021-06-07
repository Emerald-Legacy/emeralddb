import { Card, Cycle, Pack, Ruling, User } from './baseTypes'
import { CardWithVersions, CardWithDetails } from './compositeTypes'

export interface Cards$findAll {
  response: CardWithVersions[]
}

export interface Cards$find {
  response: CardWithDetails
}

export interface Cards$update {
  request: { body: Card }
  response: Card
}

export interface Cards$create {
  request: { body: Card }
  response: Card
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

export interface Ruling$create {
  request: { body: Omit<Ruling, 'id'> }
  response: Ruling
}

export interface Ruling$update {
  request: { body: Ruling }
  response: Ruling
}

export interface Ruling$delete {
  response: Ruling
}
