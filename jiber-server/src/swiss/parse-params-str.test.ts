import { parseParamsStr } from './parse-params-str'

test('quoted things should be strings', () => {
  expect(parseParamsStr(null, '"hi"')).toBe('hi')
  expect(parseParamsStr(null, "'hi'")).toBe('hi')
})

test('non quoted things should be paths', () => {
  const state = {name: {first: 'sally', last: 'mcsalls'}}
  expect(parseParamsStr(state, 'name.first')).toBe('sally')
  expect(parseParamsStr(state, 'name.last')).toBe('mcsalls')
  expect(parseParamsStr(state, 'bad.path')).toBe(undefined)
})

test('brackets should be sub-paths', () => {
  const state = {books: ['dune', 'fall'], reviews: {dune: 'sandy', fall: 'leafy'}}
  expect(parseParamsStr(state, 'reviews[books.0]')).toBe('sandy')
  expect(parseParamsStr(state, 'reviews[books.1]')).toBe('leafy')
})

test('multiple brackets should be sub-paths', () => {
  const state = {val1: 'aa', val2: 'bb', aa: {bb: 'yay'}}
  expect(parseParamsStr(state, '[val1][val2]')).toBe('yay')
  expect(parseParamsStr(state, '[val2][val1]')).toBe(undefined)
})

