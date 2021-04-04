/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'fs'
import { insertOrUpdateTrait } from '../../gateways/storage/private/trait'
import { LabelImport } from '../../model/importTypes'

export function readLabelFileAndImportTraits(path: string): void {
  const labels = fs.readFileSync(path, 'utf-8')
  const inputArray = JSON.parse(labels) as LabelImport[]
  importTraits(inputArray)
}

function importTraits(labels: LabelImport[]) {
  const traits = labels.filter((label) => label.id.startsWith('trait.'))
  console.log(`Importing ${traits.length} traits...`)
  traits.forEach((trait) =>
    insertOrUpdateTrait({ id: trait.id.substr('trait.'.length), name: trait.value })
  )
}
