import test from 'ava'
import { validateCardImport } from './ImportCardsValidatior'
import { CardImport } from '../../model/importTypes'

test('should return errors for invalid enum values', (test) => {
  const cardInput: CardImport = {
    id: 'test',
    name: 'test',
    clan: 'INVALID',
    side: 'INVALID',
    type: 'INVALID',
    unicity: false,
    role_restriction: 'INVALID',
    allowed_clans: ['INVALID'],
    element: ['INVALID_1', 'INVALID_2'],
  }
  const validationErrors = validateCardImport(cardInput)
  test.assert(validationErrors.length === 7)
  console.log(validationErrors)
  test.assert(validationErrors.includes("Unknown value for field 'clan': INVALID"))
  test.assert(validationErrors.includes("Unknown value for field 'side': INVALID"))
  test.assert(validationErrors.includes("Unknown value for field 'type': INVALID"))
  test.assert(validationErrors.includes("Unknown value for field 'role_restriction': INVALID"))
  test.assert(validationErrors.includes("Unknown value in field 'allowed_clans': INVALID"))
  test.assert(validationErrors.includes("Unknown value in field 'element': INVALID_1"))
  test.assert(validationErrors.includes("Unknown value in field 'element': INVALID_2"))
  test.pass()
})
