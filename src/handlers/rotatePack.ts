import {
  getAllCardsInPack,
  getAllFormats,
  getPack,
  insertOrUpdateCardInPack,
  insertOrUpdateFormat,
  insertOrUpdatePack,
} from '../gateways/storage/index'
import { Pack, Pack$rotate } from '@5rdb/api'
import * as Express from 'express'
import { Request } from 'express'

export async function handler(
  req: Request<Pack$rotate['request']['params']>,
  res: Express.Response
): Promise<Pack | undefined> {
  const pack = await getPack(req.params.id)
  if (!pack) {
    res.sendStatus(404)
    return
  }
  const cardsInPack = await getAllCardsInPack(pack.id)
  await Promise.all(
    cardsInPack.map(
      async (cardInPack) => await insertOrUpdateCardInPack({ ...cardInPack, rotated: true })
    )
  )
  const rotatedPack = { ...pack, rotated: true }
  await insertOrUpdatePack(rotatedPack)

  // Remove the rotated pack from the Emerald Legacy format's legal_packs array
  const formats = await getAllFormats()
  const emeraldFormat = formats.find((format) => format.id === 'emerald')
  if (emeraldFormat && emeraldFormat.legal_packs?.includes(pack.id)) {
    const updatedLegalPacks = emeraldFormat.legal_packs.filter((packId) => packId !== pack.id)
    await insertOrUpdateFormat({ ...emeraldFormat, legal_packs: updatedLegalPacks })
  }

  return rotatedPack
}
