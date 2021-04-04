import { CardImport } from '../../model/importTypes'
import { CLANS, ELEMENTS, FACTIONS, ROLE_RESTRICTIONS, SIDES, TYPES } from '../../model/enums'

export function validateCardImport(card: CardImport): string[] {
  const errors = []
  if (!card.id) {
    errors.push("Missing required field 'id'")
  }
  if (!card.name) {
    errors.push("Missing required field 'name")
  }
  if (!card.clan) {
    errors.push("Missing required field 'clan")
  } else if (!FACTIONS.find((faction) => faction === card.clan)) {
    errors.push(`Unknown value for field 'clan': ${card.clan}`)
  }
  if (!card.side) {
    errors.push("Missing required field 'side")
  } else if (!SIDES.find((side) => side === card.side)) {
    errors.push(`Unknown value for field 'side': ${card.side}`)
  }
  if (!card.type) {
    errors.push("Missing required field 'type")
  } else if (!TYPES.find((type) => type === card.type)) {
    errors.push(`Unknown value for field 'type': ${card.type}`)
  }
  if (card.role_restriction && !ROLE_RESTRICTIONS.find((role) => role === card.role_restriction)) {
    errors.push(`Unknown value for field 'role_restriction': ${card.role_restriction}`)
  }
  if (card.allowed_clans?.length !== 0) {
    card.allowed_clans?.forEach((allowedClan) => {
      if (!CLANS.find((clan) => clan === allowedClan)) {
        errors.push(`Unknown value in field 'allowed_clans': ${allowedClan}`)
      }
    })
  }
  // TODO: Validate Traits
  if (card.element?.length !== 0) {
    card.element?.forEach((inputElement) => {
      if (!ELEMENTS.find((element) => element === inputElement)) {
        errors.push(`Unknown value in field 'element': ${inputElement}`)
      }
    })
  }
  return errors
}
