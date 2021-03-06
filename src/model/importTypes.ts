export interface CardImport {
  id: string
  name: string
  name_extra?: string
  clan: string
  side: string
  type: string
  unicity: boolean
  role_restriction?: string
  text?: string
  is_restricted?: boolean
  is_restricted_in_jade?: boolean
  is_banned_in_jade?: boolean
  is_banned_in_skirmish?: boolean
  is_banned?: boolean
  allowed_clans: string[]
  traits: string[]
  cost?: string
  deck_limit?: number
  influence_cost?: number
  element: string[]
  strength?: string
  glory?: number
  fate?: number
  honor?: number
  influence_pool?: number
  strength_bonus?: string
  military?: string
  political?: string
  military_bonus?: string
  political_bonus?: string
}

export interface LabelImport {
  id: string
  value: string
}

export interface RulingImport {
  id: number
  card: { id: string }
  text: string
  source: string
  link: string
}

export interface CycleImport {
  id: string
  name: string
  position: number
  size: number
}

export interface PackImport {
  id: string
  name: string
  position: number
  size: number
  released_at?: Date
  ffg_id: string
  cycle_id: string
}

export interface PackCardImport {
  card_id: string
  flavor?: string
  illustrator?: string
  image_url?: string
  position?: string
  quantity?: number
}
