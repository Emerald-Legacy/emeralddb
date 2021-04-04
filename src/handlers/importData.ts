/* eslint-disable prettier/prettier */
import env from '../env'
import { importAllCardsInDirectory } from './import/ImportCardsHandler'
import { readLabelFileAndImportTraits } from './import/ImportTraitsHandler'

const dataDirectory: string = env.dataDirectory?.endsWith('/') ? env.dataDirectory : env.dataDirectory + '/'

export async function handler(): Promise<boolean> {
    console.log(`Importing data from ${dataDirectory}...`)
    readLabelFileAndImportTraits(dataDirectory + 'Label/en.json');
    importAllCardsInDirectory(dataDirectory + 'Card');
    return true
}
