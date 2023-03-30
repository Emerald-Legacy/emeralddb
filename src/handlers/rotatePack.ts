import {
  getAllCardsInPack,
  getPack,
  insertOrUpdateCardInPack,
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
  return rotatedPack
}
