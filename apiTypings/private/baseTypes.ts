export interface Card {
  id: string
  name: string
  name_extra?: string
  clan: string
  side: string
  type: string
  is_unique: boolean
  role_restriction?: string
  text?: string
  restricted_in?: string[]
  banned_in?: string[]
  allowed_clans?: string[]
  traits?: string[]
  cost?: string
  deck_limit?: number
  influence_cost?: number
  // Province Card Info
  elements?: string[]
  strength: string
  // Stronghold Card Info
  glory?: number
  fate?: number
  honor?: number
  influence_pool?: number
  // Holding Card Info
  strength_bonus?: string
  // Character Card Info
  military?: string
  political?: string
  // Attachment Card Info
  military_bonus?: string
  political_bonus?: string
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
  released_at?: Date
  publisher_id?: string
  cycle_id: string
}

export interface CardInPack {
  card_id: string
  pack_id: string
  flavor?: string
  illustrator?: string
  image_url?: string
  position?: string
  quantity?: number
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
