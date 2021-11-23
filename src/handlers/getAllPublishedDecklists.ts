import { getAllPublishedDecklists } from '../gateways/storage/index'
import { DecklistWithUser } from '@5rdb/api'
import { addUsernameToDecklist } from './getDecklist'

export async function handler(): Promise<DecklistWithUser[] | undefined> {
  const decklists = await getAllPublishedDecklists()
  return await Promise.all(decklists.map(async (decklist) => addUsernameToDecklist(decklist)))
}
