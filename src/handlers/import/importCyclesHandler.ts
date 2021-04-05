/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'fs'
import { insertOrUpdateCycle } from '../../gateways/storage'
import { CycleImport } from '../../model/importTypes'

export function importCyclesFile(path: string): void {
  const cycles = fs.readFileSync(path, { flag: 'rs', encoding: 'utf8' })
  const inputArray = JSON.parse(cycles) as CycleImport[]
  importCycles(inputArray)
}

function importCycles(cycles: CycleImport[]) {
  console.log(`Importing ${cycles.length} cycles...`)
  cycles.forEach((cycle) =>
    insertOrUpdateCycle({
      id: cycle.id,
      name: cycle.name,
      position: cycle.position,
      size: cycle.size,
    })
  )
}
