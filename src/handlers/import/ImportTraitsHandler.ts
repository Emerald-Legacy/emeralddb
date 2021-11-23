import { insertOrUpdateTrait } from '../../gateways/storage'
import { LabelImport } from '../../model/importTypes'
import { readFile } from '../../utils/FileSystemHelper'

export async function readLabelFileAndImportTraits(path: string): Promise<boolean> {
  const labels = readFile(path)
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
