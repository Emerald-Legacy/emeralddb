import { CardRecord, getAllCards } from '../gateways/storage/index'

export async function handler(): Promise<CardRecord[]> {
  return await getAllCards()
}
