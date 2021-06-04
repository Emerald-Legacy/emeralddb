export interface Card {
  id: string
  name: string
  name_extra?: string | undefined
  faction: string
  side: string
  type: string
  is_unique: boolean
  role_restriction?: string | undefined
  text?: string | undefined
  restricted_in?: string[] | undefined
  banned_in?: string[] | undefined
  splash_banned_in?: string[] | undefined
  allowed_clans?: string[] | undefined
  traits?: string[] | undefined
  cost?: string | undefined
  deck_limit?: number | undefined
  influence_cost?: number | undefined
  // Province Card Info
  elements?: string[] | undefined
  strength?: string | undefined
  // Stronghold Card Info
  glory?: number | undefined
  fate?: number | undefined
  honor?: number | undefined
  influence_pool?: number | undefined
  // Holding Card Info
  strength_bonus?: string | undefined
  // Character Card Info
  military?: string | undefined
  political?: string | undefined
  // Attachment Card Info
  military_bonus?: string | undefined
  political_bonus?: string | undefined
}

export interface Ruling {
  id: number
  card_id: string
  text: string
  source: string
  link: string
}

export interface Pack {
  id: string
  name: string
  position: number
  size: number
  released_at?: Date | undefined
  publisher_id?: string | undefined
  cycle_id: string
}

export interface CardInPack {
  card_id: string
  pack_id: string
  flavor?: string | undefined
  illustrator?: string | undefined
  image_url?: string | undefined
  position?: string | undefined
  quantity?: number | undefined
}

export interface Cycle {
  id: string
  name: string
  position: number
  size: number
}

export interface Trait {
  id: string
  name: string
}

export interface Format {
  id: string
  name: string
}

export interface User {
  id: string
  name?: string | undefined
  roles: string[]
}
