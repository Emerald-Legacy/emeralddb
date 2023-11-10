import { getAllFormats } from '../gateways/storage'
import { Format } from '@5rdb/api'

export async function handler(): Promise<Format[]> {
  return await getAllFormats()
}
