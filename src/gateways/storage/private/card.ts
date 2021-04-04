import { pg } from './pg'

export const TABLE = 'cards'

export interface CardRecord {
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
  strength?: string
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

export async function getAllCards(): Promise<CardRecord[]> {
  return pg(TABLE).select()
}

export async function getCard(cardId: string): Promise<CardRecord> {
  return pg(TABLE).where('id', cardId).first()
}

export async function insertOrUpdateCard(card: CardRecord): Promise<CardRecord> {
  const insert = pg(TABLE).insert({ ...card })
  const update = pg.queryBuilder().update({ ...card })
  const result = await pg.raw(`? ON CONFLICT ("id") DO ? returning *`, [insert, update])
  return result.rows[0]
}
