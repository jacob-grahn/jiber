import { set } from './set'

test('deep paths work', () => {
  const user = { name: { first: 'sue' } }
  expect(set(user, 'name.first', 'zaz')).toEqual({ name: { first: 'zaz' } })
})

test('non existant paths are automatically created', () => {
  expect(set({}, 'name.first.wee', 'apple')).toEqual({
    name: { first: { wee: 'apple' } }
  })
})

test('arrays should work', () => {
  const users = [{ name: 'bob' }, { name: 'sue' }]
  expect(set(users, '0.name', 'bip')).toEqual([{ name: 'bip' }, { name: 'sue' }])
})

test('an empty path should set the initial value', () => {
  expect(set('abc', '', 'def')).toEqual('def')
})

test('set a path with a $ref', () => {
  const state = { _users: { sam: { exp: 54 } }, player1: { $ref: '_users.sam' } }
  const newState = set(state, 'player1.bonus', 36)
  /* expect(state).toEqual({
    _users: { sam: { exp: 54 } },
    player1: { $ref: '_users.sam' } }
  ) */
  expect(newState).toEqual({
    _users: { sam: { exp: 54, bonus: 36 } },
    player1: { $ref: '_users.sam' } }
  )
})
