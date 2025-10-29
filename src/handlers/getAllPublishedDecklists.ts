import { getAllPublishedDecklists } from '../gateways/storage/index'
import { PublishedDecklistWithExtraInfo } from '@5rdb/api'
import { addUsernameToDecklist, addExtraInfoToDecklist } from './getDecklist'

export async function handler(): Promise<PublishedDecklistWithExtraInfo[] | undefined> {
  const decklists = await getAllPublishedDecklists()

  const result = await Promise.all(
    decklists.map(async (decklist) => {
      const withUser = await addUsernameToDecklist(decklist)
      const withExtraInfo = await addExtraInfoToDecklist(decklist)
      return {
        ...withUser,
        stronghold: withExtraInfo.stronghold,
        role: withExtraInfo.role,
      }
    })
  )

  return result
}
