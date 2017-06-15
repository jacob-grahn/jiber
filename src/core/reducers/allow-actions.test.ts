import allowActions from './allow-actions'

const reducer = (state: number): number => state + 1

test('it should pass allowed actions through to the reducer', () => {
  const topReducer = allowActions(reducer, ['ADD', 'SUBTRACT'])
  expect(topReducer(5, {type: 'ADD'})).toBe(6)
  expect(topReducer(5, {type: 'SUBTRACT'})).toBe(6)
})

test('it shoud not pass other actions through to the reducer', () => {
  const topReducer = allowActions(reducer, ['ADD', 'SUBTRACT'])
  expect(topReducer(5, {type: 'DIVIDE'})).toBe(5)
  expect(topReducer(5, {type: 'ROOT'})).toBe(5)
})
