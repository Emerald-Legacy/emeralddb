import env from '../env'
import { importAllCardsInDirectory } from './import/ImportCardsHandler'
import { importAllCardsInPacksInDirectory } from './import/ImportCardsInPacksHandler'
import { importRulingsFile } from './import/ImportRulingsHandler'
import { importCyclesFile } from './import/ImportCyclesHandler'
import { importPacksFile } from './import/ImportPacksHandler'
import { readLabelFileAndImportTraits } from './import/ImportTraitsHandler'

const dataDirectory: string = env.dataDirectory?.endsWith('/')
  ? env.dataDirectory
  : env.dataDirectory + '/'

export async function handler(): Promise<boolean> {
  console.log(`Importing data from ${dataDirectory}...`)
  await readLabelFileAndImportTraits(dataDirectory + 'Label/en.json')
  await importAllCardsInDirectory(dataDirectory + 'Card')
  await importRulingsFile(dataDirectory + 'Ruling/rulings.json')
  await importCyclesFile(dataDirectory + 'Cycle.json')
  await importPacksFile(dataDirectory + 'Pack.json')
  await importAllCardsInPacksInDirectory(dataDirectory + 'PackCard')
  console.log('Import finished!')
  return true
}
