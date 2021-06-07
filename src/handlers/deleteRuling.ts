import { getRuling, deleteRuling } from '../gateways/storage/index'
import { Request, Response } from 'express'

export async function handler(req: Request, res: Response): Promise<void> {
  const rulingId = Number.parseInt(req.params.rulingId)
  if (!rulingId || isNaN(rulingId)) {
    res.status(400).send()
    return
  }
  const ruling = await getRuling(rulingId)
  if (!ruling) {
    res.status(404).send()
    return
  }
  await deleteRuling(rulingId)
  res.status(200).send()
}
