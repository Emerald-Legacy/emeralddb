import { insertOrUpdateCardInPack } from '../../gateways/storage'
import { PackCardImport } from '../../model/importTypes'
import { getFilesInDirectory, readFile } from '../../utils/FileSystemHelper'

export async function importAllCardsInPacksInDirectory(directory: string): Promise<boolean> {
  const allFiles = getFilesInDirectory(directory)
  console.log(`Importing ${allFiles.length} 'PackCard' files...`)
  allFiles.forEach((packFile) => importCardsInPack(packFile))
  return true
}

export function importCardsInPack(path: string): void {
  const packFileName = path.substr(path.lastIndexOf('/') + 1)
  const packId = packFileName.substr(0, packFileName.length - '.json'.length)
  console.log(`Importing cards for pack ${packId}...`)
  const stringBuffer = readFile(path)
  const cardsInPack = JSON.parse(stringBuffer) as PackCardImport[]
  cardsInPack.forEach(async (cardInPack) => {
    await insertOrUpdateCardInPack({
      card_id: cardInPack.card_id,
      pack_id: packId,
      flavor: cardInPack.flavor,
      illustrator: cardInPack.illustrator,
      image_url: cardInPack.image_url,
      position: cardInPack.position,
      quantity: cardInPack.quantity,
      rotated: false,
    })
  })
}
