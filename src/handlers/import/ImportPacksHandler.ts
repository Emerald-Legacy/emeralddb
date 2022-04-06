import { insertOrUpdatePack } from '../../gateways/storage'
import { PackImport } from '../../model/importTypes'
import { readFile } from '../../utils/FileSystemHelper'

export async function importPacksFile(path: string): Promise<boolean> {
  const packs = readFile(path)
  const inputArray = JSON.parse(packs) as PackImport[]
  await importPacks(inputArray)
  return true
}

async function importPacks(packs: PackImport[]) {
  console.log(`Importing ${packs.length} packs...`)
  packs.forEach(
    async (pack) =>
      await insertOrUpdatePack({
        id: pack.id,
        name: pack.name,
        position: pack.position,
        size: pack.size,
        released_at: pack.released_at,
        publisher_id: pack.ffg_id,
        cycle_id: pack.cycle_id,
        rotated: false
      })
  )
}
