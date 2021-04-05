/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'fs'
import { insertOrUpdateCycle } from '../../gateways/storage'
import { CycleImport } from '../../model/importTypes'

export async function importCyclesFile(path: string): Promise<boolean> {
  const cycles = fs.readFileSync(path, { flag: 'rs', encoding: 'utf8' })
  const inputArray = JSON.parse(cycles) as CycleImport[]
  await importCycles(inputArray)
  return true
}

async function importCycles(cycles: CycleImport[]) {
  console.log(`Importing ${cycles.length} cycles...`)
  cycles.forEach(
    async (cycle) =>
      await insertOrUpdateCycle({
        id: cycle.id,
        name: cycle.name,
        position: cycle.position,
        size: cycle.size,
      })
  )
}
