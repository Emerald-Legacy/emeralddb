/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'fs'
import { insertOrUpdateTrait } from '../../gateways/storage'
import { LabelImport } from '../../model/importTypes'

export async function readLabelFileAndImportTraits(path: string): Promise<boolean> {
  const labels = fs.readFileSync(path, { flag: 'rs', encoding: 'utf8' })
  const inputArray = JSON.parse(labels) as LabelImport[]
  importTraits(inputArray)
  return true
}

async function importTraits(labels: LabelImport[]) {
  const traits = labels.filter((label) => label.id.startsWith('trait.'))
  console.log(`Importing ${traits.length} traits...`)
  traits.forEach(
    async (trait) =>
      await insertOrUpdateTrait({ id: trait.id.substr('trait.'.length), name: trait.value })
  )
}
