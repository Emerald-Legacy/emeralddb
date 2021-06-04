import { getAllCardVersions, getCard } from '../gateways/storage/index'
import { Request, Response } from 'express'
import { getAllRulingsForCard } from '../gateways/storage/private/ruling'
import { CardWithDetails } from '@5rdb/api'

export async function handler(
  req: Request<{ cardId: string }>,
  res: Response
): Promise<CardWithDetails | undefined> {
  const card = await getCard(req.params.cardId)
  if (!card) {
    res.sendStatus(404)
    return
  }
  const cardVersions = await getAllCardVersions(card.id)
  const rulings = await getAllRulingsForCard(card.id)
  return {
    ...card,
    versions: cardVersions.map((version) => ({ ...version })),
    rulings: rulings.map((ruling) => ({ ...ruling })),
  }
}
