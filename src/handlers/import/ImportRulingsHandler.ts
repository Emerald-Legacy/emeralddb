/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'fs'
import { insertOrUpdateRulingWithExistingId } from '../../gateways/storage'
import { RulingImport } from '../../model/importTypes'

export async function importRulingsFile(path: string): Promise<boolean> {
  const rulings = fs.readFileSync(path, { flag: 'rs', encoding: 'utf8' })
  const inputArray = JSON.parse(rulings) as RulingImport[]
  await importRulings(inputArray)
  return true
}

async function importRulings(rulings: RulingImport[]) {
  console.log(`Importing ${rulings.length} rulings...`)
  rulings.forEach(
    async (ruling) =>
      await insertOrUpdateRulingWithExistingId({
        id: ruling.id,
        card_id: ruling.card.id,
        text: ruling.text,
        source: ruling.source,
        link: ruling.link,
      })
  )
}
