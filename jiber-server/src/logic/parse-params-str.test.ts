import { parseParamsStr } from './parse-params-str'

test('brackets should be replaced', () => {
  const state = { books: ['dune', 'fall'] }
  expect(parseParamsStr(state, 'reviews[books.0]')).toBe('reviews.dune')
  expect(parseParamsStr(state, 'reviews[books.1][books.0]')).toBe('reviews.fall.dune')
})

test('multiple brackets should be sub-paths', () => {
  const state = { val1: 'aa', val2: 'bb', aa: { bb: 'yay' } }
  expect(parseParamsStr(state, '[val1][val2]')).toBe('aa.bb')
  expect(parseParamsStr(state, '[val2][val1]')).toBe('bb.aa')
})

test('dollar regex is replaced', () => {
  const state = { val1: 'aa', val2: 'bb' }
  expect(parseParamsStr(state, 'var${val1}.var${val2}')).toBe('varaa.varbb')
  expect(parseParamsStr(state, '[val2][val1]')).toBe('bb.aa')
})

test('dollar regex is parsed before bracket', () => {
  const state = { val1: 'aa', aaron: 'pilot' }
  expect(parseParamsStr(state, 'occupation[${val1}ron]')).toBe('occupation.pilot')
})