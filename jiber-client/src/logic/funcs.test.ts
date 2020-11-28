import { funcs } from './funcs'

test('SET', () => {
  const result = funcs.SET({}, 'a.path', '"yay"')
  expect(result).toEqual({ type: 'SET', path: 'a.path', value: 'yay' })
})

test('ADD', () => {
  const result = funcs.ADD({ tally: 10 }, 'tally', 55)
  expect(result).toEqual({ type: 'ADD', path: 'tally', value: 55 })
})

test('PUSH', () => {
  const result = funcs.PUSH({}, 'a.path', 55)
  expect(result).toEqual({ type: 'PUSH', path: 'a.path', value: 55 })
})

test('POP', () => {
  const result = funcs.POP({ arr: [1,2] }, 'arr', 'dest.path')
  expect(result).toEqual({ type: 'POP', path: 'arr', destPath: 'dest.path' })
})

test('SPLICE', () => {
  const result = funcs.SPLICE({ arr: [1,2] }, 'arr', 0, 2, 'dest.path', 3, 4)
  expect(result).toEqual({
    type: 'SPLICE',
    path: 'arr',
    start: 0,
    count: 2,
    items: [3, 4],
    destPath: 'dest.path'
  })
})

test('CHECK', () => {
  const state = { value: 1, str: 'bat' }
  expect(funcs.CHECK(state, 'value', '>', 2)).toBe(false)
  expect(funcs.CHECK(state, 'value', '>=', 1)).toBe(true)
  expect(funcs.CHECK(state, 'str', '~=', '"b.*t"')).toBe(true)
  expect(funcs.CHECK(state, 'str', '~=', '"b.*g"')).toBe(false)
})

test('IF', () => {
  const result = funcs.IF({}, 1, '==', 1, [
    ['SET', 'winner', true]
  ],[
    ['SET', 'winner', false]
  ])
  expect(result).toEqual({ addSteps: [['SET', 'winner', true]] })
})
