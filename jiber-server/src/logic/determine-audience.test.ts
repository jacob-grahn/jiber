import { determineAudience } from './determine-audience'

test('root path actions are not private', () => {
  const action: any = { type: 'TEST', path: '' }
  const state: any = {}
  determineAudience(state, action)
  expect(action.$sendOnlyTo).toBe(undefined)
  expect(action.$doNotSend).toBe(undefined)
})

test('actions with no path are not private', () => {
  const action: any = { type: 'TEST' }
  const state: any = {}
  determineAudience(state, action)
  expect(action.$sendOnlyTo).toBe(undefined)
  expect(action.$doNotSend).toBe(undefined)
})

test('actions on public user fields are public', () => {
  const action: any = { type: 'TEST', path: 'users.bob123.publicSauce' }
  const state: any = {}
  determineAudience(state, action)
  expect(action.$sendOnlyTo).toBe(undefined)
  expect(action.$doNotSend).toBe(undefined)
})

test('actions on a user private state is only sent to the user', () => {
  const action: any = { type: 'TEST', path: 'player1._secretSauce' }
  const state: any = { player1: { userId: 'bob123', _secretSauce: 'wow' } }
  determineAudience(state, action)
  expect(action.$sendOnlyTo).toBe('bob123')
  expect(action.$doNotSend).toBe(undefined)
})

test('actions that begin with _ are not sent out', () => {
  const action: any = { type: 'TEST', path: 'land._secret' }
  const state: any = {}
  determineAudience(state, action)
  expect(action.$sendOnlyTo).toBe(undefined)
  expect(action.$doNotSend).toBe(true)
})

test('private user actions work with refs',  () => {
  const action: any = { type: 'TEST', path: 'player1._secretSauce' }
  const state: any = { 
    player1: { $ref: '$users.bob123' },
    $users: { bob123:  { userId: 'bob123', _secretSauce: 'wow' } }
  }
  determineAudience(state, action)
  expect(action.$sendOnlyTo).toBe('bob123')
  expect(action.$doNotSend).toBe(undefined)
})
