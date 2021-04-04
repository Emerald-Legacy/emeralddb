export const enum CLAN {
  CRAB = 'crab',
  CRANE = 'crane',
  DRAGON = 'dragon',
  LION = 'lion',
  PHOENIX = 'phoenix',
  SCORPION = 'scorpion',
  UNICORN = 'unicorn',
}

export const CLANS: CLAN[] = [
  CLAN.CRAB,
  CLAN.CRANE,
  CLAN.DRAGON,
  CLAN.LION,
  CLAN.PHOENIX,
  CLAN.SCORPION,
  CLAN.UNICORN,
]

export enum FACTION {
  CRAB = 'crab',
  CRANE = 'crane',
  DRAGON = 'dragon',
  LION = 'lion',
  PHOENIX = 'phoenix',
  SCORPION = 'scorpion',
  UNICORN = 'unicorn',
  NEUTRAL = 'neutral',
  SHADOWLANDS = 'shadowlands',
}

export const FACTIONS: FACTION[] = [
  FACTION.CRAB,
  FACTION.CRANE,
  FACTION.DRAGON,
  FACTION.LION,
  FACTION.PHOENIX,
  FACTION.SCORPION,
  FACTION.UNICORN,
  FACTION.NEUTRAL,
  FACTION.SHADOWLANDS,
]

export enum SIDE {
  CONFLICT = 'conflict',
  DYNASTY = 'dynasty',
  PROVINCE = 'province',
  ROLE = 'role',
  TREATY = 'treaty',
}

export const SIDES: SIDE[] = [SIDE.CONFLICT, SIDE.DYNASTY, SIDE.PROVINCE, SIDE.ROLE, SIDE.TREATY]

export enum TYPE {
  ATTACHMENT = 'attachment',
  CHARACTER = 'character',
  EVENT = 'event',
  HOLDING = 'holding',
  PROVINCE = 'province',
  ROLE = 'role',
  STRONGHOLD = 'stronghold',
  TREATY = 'treaty',
}

export const TYPES: TYPE[] = [
  TYPE.ATTACHMENT,
  TYPE.CHARACTER,
  TYPE.EVENT,
  TYPE.HOLDING,
  TYPE.PROVINCE,
  TYPE.ROLE,
  TYPE.STRONGHOLD,
  TYPE.TREATY,
]

export enum ELEMENT {
  AIR = 'air',
  EARTH = 'earth',
  FIRE = 'fire',
  VOID = 'void',
  WATER = 'water',
}

export const ELEMENTS: ELEMENT[] = [
  ELEMENT.AIR,
  ELEMENT.EARTH,
  ELEMENT.FIRE,
  ELEMENT.VOID,
  ELEMENT.WATER,
]

export enum ROLE_RESTRICTION {
  AIR = 'air',
  EARTH = 'earth',
  FIRE = 'fire',
  VOID = 'void',
  WATER = 'water',
  KEEPER = 'keeper',
  SEEKER = 'seeker',
}

export const ROLE_RESTRICTIONS: ROLE_RESTRICTION[] = [
  ROLE_RESTRICTION.AIR,
  ROLE_RESTRICTION.EARTH,
  ROLE_RESTRICTION.FIRE,
  ROLE_RESTRICTION.VOID,
  ROLE_RESTRICTION.WATER,
  ROLE_RESTRICTION.KEEPER,
  ROLE_RESTRICTION.SEEKER,
]

export enum FORMAT {
  STRONGHOLD = 'standard',
  SINGLE_CORE = 'single-core',
  SKIRMISH = 'skirmish',
  JADE_EDICT = 'jade-edict',
  ENLIGHTENMENT = 'enlightenment',
}

export const FORMATS: FORMAT[] = [
  FORMAT.STRONGHOLD,
  FORMAT.SINGLE_CORE,
  FORMAT.SKIRMISH,
  FORMAT.JADE_EDICT,
  FORMAT.ENLIGHTENMENT,
]
