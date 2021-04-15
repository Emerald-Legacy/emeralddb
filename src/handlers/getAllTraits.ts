import { getAllTraits } from '../gateways/storage/index'
import { Trait } from '@5rdb/api'

export async function handler(): Promise<Trait[]> {
  return await getAllTraits()
}
