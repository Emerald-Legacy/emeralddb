/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'fs'
import { CardRecord, insertOrUpdateCard } from '../../gateways/storage/index'
import { CardImport } from '../../model/importTypes'
import { validateCardImport } from './ImportCardsValidatior'

export function importAllCardsInDirectory(directory: string): void {
  function getFilesInDirectory(dir: string, allFiles?: string[]) {
    allFiles = allFiles || []
    const files = fs.readdirSync(dir)
    for (const i in files) {
      const name = dir + '/' + files[i]
      if (fs.statSync(name).isDirectory()) {
        getFilesInDirectory(name, allFiles)
      } else {
        allFiles.push(name)
      }
    }
    return allFiles
  }

  const allFiles = getFilesInDirectory(directory)
  console.log(`Importing ${allFiles.length} cards...`)
  allFiles.forEach((file) => importCardFile(file))
}

export function importCardFile(path: string): void {
  const banzai = fs.readFileSync(path, 'utf-8')
  const inputArray = JSON.parse(banzai) as CardImport[]
  importCardJson(inputArray[0])
}

export function importCardJson(card: CardImport): void {
  const cardRecord = mapInputToRecord(card)
  insertOrUpdateCard(cardRecord).catch((error) =>
    console.log(`Insert failed for card ${card.id}: ${error}`)
  )
}

function mapInputToRecord(card: CardImport): CardRecord {
  const validationErrors = validateCardImport(card)
  if (validationErrors.length > 0) {
    let errorMessage = `Validation failed for card '${card.id}':\n`
    validationErrors.forEach((error: string) => {
      errorMessage += error
    })
    throw new Error(errorMessage)
  }
  const restricted_in = []
  if (card.is_restricted) {
    restricted_in.push('standard')
  }
  if (card.is_restricted_in_jade) {
    restricted_in.push('jade_edict')
  }
  const banned_in = []
  if (card.is_banned) {
    banned_in.push('standard')
  }
  if (card.is_banned_in_jade) {
    banned_in.push('jade_edict')
  }
  if (card.is_banned_in_skirmish) {
    banned_in.push('skirmish')
  }

  return {
    id: card.id,
    name: card.name,
    name_extra: card.name_extra,
    clan: card.clan,
    side: card.side,
    type: card.type,
    is_unique: card.unicity,
    role_restriction: card.role_restriction,
    text: card.text,
    restricted_in: restricted_in,
    banned_in: banned_in,
    allowed_clans: card.allowed_clans,
    traits: card.traits,
    cost: card.cost,
    deck_limit: card.deck_limit,
    influence_cost: card.influence_cost,
    elements: card.element,
    strength: card.strength,
    glory: card.glory,
    fate: card.fate,
    honor: card.honor,
    influence_pool: card.influence_pool,
    strength_bonus: card.strength_bonus,
    military: card.military,
    political: card.political,
    military_bonus: card.military_bonus,
    political_bonus: card.political_bonus,
  }
}
