import { parseParams } from './parse-params'

test('numbers, undefined, and boolean should be left alone', () => {
  expect(parseParams(null, 1)).toBe(1)
  expect(parseParams(null, true)).toBe(true)
  expect(parseParams(null, undefined)).toBe(undefined)
})

test('quoted things should be strings', () => {
  expect(parseParams(null, '"hi"')).toBe('hi')
  expect(parseParams(null, "'hi'")).toBe('hi')
})

test('non quoted things should be paths', () => {
  const state = { name: { first: 'sally', last: 'mcsalls' } }
  expect(parseParams(state, 'name.first')).toBe('sally')
  expect(parseParams(state, 'name.last')).toBe('mcsalls')
  expect(parseParams(state, 'bad.path')).toBe(undefined)
})

test('brackets should be sub-paths', () => {
  const state = { books: ['dune', 'fall'], reviews: { dune: 'sandy', fall: 'leafy' } }
  expect(parseParams(state, 'reviews[books.0]')).toBe('sandy')
  expect(parseParams(state, 'reviews[books.1]')).toBe('leafy')
})

test('multiple brackets should be sub-paths', () => {
  const state = { val1: 'aa', val2: 'bb', aa: { bb: 'yay' } }
  expect(parseParams(state, '[val1][val2]')).toBe('yay')
  expect(parseParams(state, '[val2][val1]')).toBe(undefined)
})
