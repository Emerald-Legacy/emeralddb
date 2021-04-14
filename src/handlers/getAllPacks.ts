import { getAllPacks } from '../gateways/storage/index'
import { Pack } from '@5rdb/api'

export async function handler(): Promise<Pack[]> {
  return await getAllPacks()
}
