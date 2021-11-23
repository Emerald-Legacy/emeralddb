import { getAllCycles } from '../gateways/storage/index'
import { Cycle } from '@5rdb/api'

export async function handler(): Promise<Cycle[]> {
  return await getAllCycles()
}
