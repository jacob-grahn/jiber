import { determineAudience } from './determine-audience'

test('root path actions are not private', () => {
  const action: any = { type: 'TEST', path: '' }
  determineAudience(action)
  expect(action.$sendOnlyTo).toBe(undefined)
  expect(action.$doNotSend).toBe(undefined)
})

test('actions with no path are not private', () => {
  const action: any = { type: 'TEST' }
  determineAudience(action)
  expect(action.$sendOnlyTo).toBe(undefined)
  expect(action.$doNotSend).toBe(undefined)
})

test('actions on public user fields are public', () => {
  const action: any = { type: 'TEST', path: 'users.bob123.publicSauce' }
  determineAudience(action)
  expect(action.$sendOnlyTo).toBe(undefined)
  expect(action.$doNotSend).toBe(undefined)
})

test('actions on users.userId._* fields are only sent to the user', () => {
  const action: any = { type: 'TEST', path: 'users.bob123._secretSauce' }
  determineAudience(action)
  expect(action.$sendOnlyTo).toBe('bob123')
  expect(action.$doNotSend).toBe(undefined)
})

test('actions that begin with _ are not sent out', () => {
  const action: any = { type: 'TEST', path: 'land._secret' }
  determineAudience(action)
  expect(action.$sendOnlyTo).toBe(undefined)
  expect(action.$doNotSend).toBe(true)
})
