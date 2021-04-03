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

export interface Cards$findAll {
  response: Card[]
}
