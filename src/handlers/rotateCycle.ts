import {
  getAllCardsInPack,
  getAllPacks,
  getCycle,
  insertOrUpdateCardInPack,
  insertOrUpdateCycle,
  insertOrUpdatePack,
} from '../gateways/storage/index'
import { Cycles$rotate, Cycle } from '@5rdb/api'
import * as Express from 'express'
import { Request } from 'express'

export async function handler(
  req: Request<Cycles$rotate['request']['params']>,
  res: Express.Response
): Promise<Cycle | undefined> {
  const cycle = await getCycle(req.params.id)
  if (!cycle) {
    res.sendStatus(404)
    return
  }
  const packsInCycle = (await getAllPacks()).filter((pack) => pack.cycle_id === cycle.id)
  await Promise.all(
    packsInCycle.map(async (pack) => {
      const cardsInPack = await getAllCardsInPack(pack.id)
      await Promise.all(
        cardsInPack.map(
          async (cardInPack) => await insertOrUpdateCardInPack({ ...cardInPack, rotated: true })
        )
      )
      await insertOrUpdatePack({ ...pack, rotated: true })
    })
  )
  const rotatedCycle = { ...cycle, rotated: true }
  await insertOrUpdateCycle(rotatedCycle)
  return rotatedCycle
}
