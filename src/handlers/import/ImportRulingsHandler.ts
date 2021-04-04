/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'fs'
import { insertOrUpdateRuling } from '../../gateways/storage'
import { RulingImport } from '../../model/importTypes'

export function importRulingsFile(path: string): void {
  const rulings = fs.readFileSync(path, { flag: 'rs', encoding: 'utf8' })
  const inputArray = JSON.parse(rulings) as RulingImport[]
  importRulings(inputArray)
}

function importRulings(rulings: RulingImport[]) {
  console.log(`Importing ${rulings.length} rulings...`)
  rulings.forEach((ruling) =>
    insertOrUpdateRuling({
      id: ruling.id,
      card_id: ruling.card.id,
      text: ruling.text,
      source: ruling.source,
      link: ruling.link,
    })
  )
}
