import allowActions from './allow-actions'

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
  const topReducer = allowActions(reducer, ['ADD', 'SUBTRACT'])
  expect(topReducer(5, {type: 'ADD'})).toBe(6)
  expect(topReducer(5, {type: 'SUBTRACT'})).toBe(4)
})

test('it shoud not pass other actions through to the reducer', () => {
  const topReducer = allowActions(reducer, ['ADD', 'SUBTRACT'])
  expect(topReducer(5, {type: 'DIVIDE'})).toBe(5)
  expect(topReducer(5, {type: 'ROOT'})).toBe(5)
})

test('if action is disallowed, return default state of sub-reducer', () => {
  const topReducer = allowActions(reducer, ['ADD', 'SUBTRACT'])
  expect(topReducer(undefined, {type: 'MULTIPLY'})).toBe(0)
})
