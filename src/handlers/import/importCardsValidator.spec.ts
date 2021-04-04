import test from 'ava'
import { validateCardImport } from './ImportCardsValidatior'
import { CardImport } from '../../model/importTypes'
import { TraitRecord } from '../../gateways/storage/index'

test('should return errors for invalid enum values', (test) => {
  const cardInput: CardImport = {
    id: 'test',
    name: 'test',
    clan: 'INVALID',
    side: 'INVALID',
    type: 'INVALID',
    unicity: false,
    traits: ['INVALID'],
    role_restriction: 'INVALID',
    allowed_clans: ['INVALID'],
    element: ['INVALID_1', 'INVALID_2'],
  }
  const traits: TraitRecord[] = [{ id: 'bushi', name: 'Bushi' }]
  const validationErrors = validateCardImport(cardInput, traits)
  test.assert(validationErrors.length === 8)
  test.assert(validationErrors.includes("Unknown value for field 'clan': INVALID"))
  test.assert(validationErrors.includes("Unknown value for field 'side': INVALID"))
  test.assert(validationErrors.includes("Unknown value for field 'type': INVALID"))
  test.assert(validationErrors.includes("Unknown value for field 'role_restriction': INVALID"))
  test.assert(validationErrors.includes("Unknown value in field 'allowed_clans': INVALID"))
  test.assert(validationErrors.includes("Unknown value in field 'traits': INVALID"))
  test.assert(validationErrors.includes("Unknown value in field 'element': INVALID_1"))
  test.assert(validationErrors.includes("Unknown value in field 'element': INVALID_2"))
  test.pass()
})

test('should validate valid card successfully', (test) => {
  const cardInput: CardImport = {
    id: 'niten-master',
    name: 'Niten Master',
    clan: 'dragon',
    side: 'dynasty',
    type: 'character',
    unicity: false,
    traits: ['bushi'],
    role_restriction: 'keeper',
    allowed_clans: ['dragon', 'phoenix'],
    element: ['air', 'void'],
  }
  const traits: TraitRecord[] = [{ id: 'bushi', name: 'Bushi' }]
  const validationErrors = validateCardImport(cardInput, traits)
  test.assert(validationErrors.length === 0)
  test.pass()
})
