import { createAllowActions } from './allow-actions'

const reducer = (state: number = 0, action: any): number => {
  switch (action.type) {
    case 'ADD':
      return state + 1
    case 'SUBTRACT':
      return state - 1
    default:
      return state
  }
}

test('it should pass allowed actions through to the reducer', () => {
  const allowActions = createAllowActions(reducer, ['ADD', 'SUBTRACT'])
  expect(allowActions(5, { type: 'ADD' })).toBe(6)
  expect(allowActions(5, { type: 'SUBTRACT' })).toBe(4)
})

test('it shoud not pass other actions through to the reducer', () => {
  const allowActions = createAllowActions(reducer, ['SUBTRACT'])
  expect(allowActions(5, { type: 'ADD' })).toBe(5)
  expect(allowActions(5, { type: 'ROOT' })).toBe(5)
})

test('if action is disallowed, return default state of sub-reducer', () => {
  const allowActions = createAllowActions(reducer, ['ADD', 'SUBTRACT'])
  expect(allowActions(undefined, { type: 'MULTIPLY' })).toBe(0)
})
