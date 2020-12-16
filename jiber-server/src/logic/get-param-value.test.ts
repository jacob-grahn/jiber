import { getParamValue } from './get-param-value'

test('non strings are ignored', () => {
  const state = {}
  const param = 5
  expect(getParamValue(state, param)).toBe(5)
})

test('quoted strings are de-quoted', () => {
  const state = {}
  const param = '"hi"'
  expect(getParamValue(state, param)).toBe('hi')
})

test('non-quoted strings are used as paths', () => {
  const state = { pizzas: 3 }
  const param = 'pizzas'
  expect(getParamValue(state, param)).toBe(3)
})

test('get by reference', () => {
  const state = { _users: {bob: 'my name is bob'}, player1: {$ref: '_users.bob'} }
  const param = 'player1'
  expect(getParamValue(state, param)).toBe('my name is bob')
})