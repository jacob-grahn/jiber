import { parseParams } from './parse-params'

test('numbers, undefined, arrays and booleans should be left alone', () => {
  expect(parseParams(null, 1)).toBe(1)
  expect(parseParams(null, true)).toBe(true)
  expect(parseParams(null, undefined)).toBe(undefined)
  expect(parseParams(null, [1])).toEqual([1])
})

test('quoted things should be strings', () => {
  expect(parseParams(null, '"hi[there]"')).toBe('hi[there]')
  expect(parseParams(null, "'hi[hello]'")).toBe('hi[hello]')
})

test('non quoted things should be left alone', () => {
  expect(parseParams(null, 'name.first')).toBe('name.first')
})

test('brackets should be sub-paths', () => {
  const state = { books: ['dune', 'fall'] }
  expect(parseParams(state, 'reviews[books.0]')).toBe('reviews.dune')
  expect(parseParams(state, 'reviews[books.1]')).toBe('reviews.fall')
})

test('multiple brackets should be sub-paths', () => {
  const state = { val1: 'aa', val2: 'bb' }
  expect(parseParams(state, '[val1][val2]')).toBe('aa.bb')
  expect(parseParams(state, '[val2][val1]')).toBe('bb.aa')
})
