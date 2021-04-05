/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'fs'
import { insertOrUpdatePack } from '../../gateways/storage'
import { PackImport } from '../../model/importTypes'

export async function importPacksFile(path: string): Promise<boolean> {
  const packs = fs.readFileSync(path, { flag: 'rs', encoding: 'utf8' })
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
      })
  )
}
