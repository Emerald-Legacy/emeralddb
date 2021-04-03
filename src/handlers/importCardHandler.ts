import fs from 'fs';
import { CardRecord, getCard, insertOrUpdateCard } from '../gateways/storage/index'


export function importAllCardsInDirectory(path: string) {
    function getFilesInDirectory(dir: string, allFiles?: string[]){
        allFiles = allFiles || [];
        var files = fs.readdirSync(dir);
        for (var i in files){
            var name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()){
                getFilesInDirectory(name, allFiles);
            } else {
                allFiles.push(name);
            }
        }
        return allFiles;
    }

    const allFiles = getFilesInDirectory('C:/Projekte/5RDB_legacy/fiveringsdb-data/json/Card')
    console.log(`Importing ${allFiles.length} cards...`)
    allFiles.forEach(file => importCardFile(file))
}

export function importCardFile(path: string) {
    const banzai = fs.readFileSync(path, 'utf-8')
    const inputArray = JSON.parse(banzai) as CardInput[]
    importCardJson(inputArray[0])
}

export async function importCardJson(card: CardInput) {
    const cardRecord = mapInputToRecord(card)
    insertOrUpdateCard(cardRecord)
        .then(() => {})
        .catch((error) => console.log(`Insert failed for card ${card.id}: ${error}`))
}

function mapInputToRecord(card: CardInput): CardRecord {
    const restricted_in = []
    if (card.is_restricted) {
        restricted_in.push('standard')
    }
    if (card.is_restricted_in_jade) {
        restricted_in.push('jade_edict')
    }
    const banned_in = []
    if (card.is_banned) {
        banned_in.push('standard')
    }
    if (card.is_banned_in_jade) {
        banned_in.push('jade_edict')
    }
    if (card.is_banned_in_skirmish) {
        banned_in.push('skirmish')
    }

    return {
        id: card.id,
        name: card.name,
        name_extra: card.name_extra,
        clan: card.clan,
        side: card.side,
        type: card.type,
        is_unique: card.unicity,
        role_restriction: card.role_restriction,
        text: card.text,
        restricted_in: restricted_in,
        banned_in: banned_in,
        allowed_clans: card.allowed_clans,
        traits: card.traits,
        cost: card.cost,
        deck_limit: card.deck_limit,
        influence_cost: card.influence_cost,
        elements: card.element,
        strength: card.strength,
        glory: card.glory,
        fate: card.fate,
        honor: card.honor,
        influence_pool: card.influence_pool,
        strength_bonus: card.strength_bonus,
        military: card.military,
        political: card.political,
        military_bonus: card.military_bonus,
        political_bonus: card.political_bonus
    }
}

export interface CardInput {
    id: string
    name: string
    name_extra?: string
    clan: string 
    side: string
    type: string
    unicity: boolean
    role_restriction?: string
    text?: string
    is_restricted?: boolean
    is_restricted_in_jade?: boolean
    is_banned_in_jade?: boolean
    is_banned_in_skirmish?: boolean
    is_banned?: boolean
    allowed_clans?: string[]
    traits?: string[]
    cost?: string
    deck_limit?: number
    influence_cost?: number
    element?: string[]
    strength: string
    glory?: number
    fate?: number
    honor?: number
    influence_pool?: number
    strength_bonus?: string
    military?: string
    political?: string
    military_bonus?: string
    political_bonus?: string
  }
