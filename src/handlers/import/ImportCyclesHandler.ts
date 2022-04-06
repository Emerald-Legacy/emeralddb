import { insertOrUpdateCycle } from '../../gateways/storage'
import { CycleImport } from '../../model/importTypes'
import { readFile } from '../../utils/FileSystemHelper'

export async function importCyclesFile(path: string): Promise<boolean> {
  const cycles = readFile(path)
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
        rotated: false,
      })
  )
}
