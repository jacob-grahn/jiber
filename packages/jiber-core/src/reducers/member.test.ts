import { member } from './member'

test('actions from the server can update actionId', () => {
  const state = { userId: 'fil', actionId: 1 }
  const action = { type: 'wee', $u: 'fil', $id: 5, $confirmed: true }
  expect(member(state, action)).toEqual({ userId: 'fil', actionId: 5 })
})

test('actions without $u are ignored', () => {
  const state = { userId: 'fil', actionId: 1 }
  const action = { type: 'wee' }
  expect(member(state, action)).toEqual({ userId: 'fil', actionId: 1 })
})
