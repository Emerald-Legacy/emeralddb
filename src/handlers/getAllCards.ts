import {getAllCards} from '../gateways/storage/index'

export async function handler() {
    return await getAllCards();
}