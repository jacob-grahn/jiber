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
  const state = { value: 1, str: 'bat', land: null, bool: false }
  expect(funcs.CHECK(state, 'value', '>', 2)).toBe(false)
  expect(funcs.CHECK(state, 'value', '>=', 1)).toBe(true)
  expect(funcs.CHECK(state, 'str', '~=', '"b.*t"')).toBe(true)
  expect(funcs.CHECK(state, 'str', '~=', '"b.*g"')).toBe(false)

  expect(funcs.CHECK(state, 'str', '?', true)).toBe(true)
  expect(funcs.CHECK(state, 'str', '?', false)).toBe(false)
  expect(funcs.CHECK(state, 'land', '?', true)).toBe(false)
  expect(funcs.CHECK(state, 'lalala', '?', true)).toBe(false)
  expect(funcs.CHECK(state, 'bool', '?', true)).toBe(true)
})

test('IF', () => {
  const result = funcs.IF({}, 1, '==', 1, [
    ['SET', 'winner', true]
  ],[
    ['SET', 'winner', false]
  ])
  expect(result).toEqual({ addSteps: [['SET', 'winner', true]] })
})

test('SHUFFLE', () => {
  const state = { arr: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
  const result = funcs.SHUFFLE(state, 'arr')
  const shuffledArr = result.value

  // the same number of elements are present
  expect(shuffledArr.length).toBe(state.arr.length)

  // the original array is not mutated
  expect(state.arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])

  // the shuffled array is not the same as the origianl
  expect(state.arr).not.toEqual(shuffledArr)
})
