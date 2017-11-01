import { functionify } from './functionify'

test('===', () => {
  expect(functionify('one === two')).toBe('eq(one, two)')
})

test('==', () => {
  expect(functionify('one == two')).toBe('eq(one, two)')
})

test('!==', () => {
  expect(functionify('one !== two')).toBe('neq(one, two)')
})

test('!=', () => {
  expect(functionify('one != two')).toBe('neq(one, two)')
})

test('>', () => {
  expect(functionify('city.population > 5')).toBe('gt(city.population, 5)')
})

test('<', () => {
  expect(functionify('one < two')).toBe('lt(one, two)')
})

test('>=', () => {
  expect(functionify('one >= two')).toBe('gte(one, two)')
})

test('<=', () => {
  expect(functionify('one <= two')).toBe('lte(one, two)')
})

test('ingore other kinds of strings', () => {
  expect(functionify('`twas the ${night}`')).toBe('`twas the ${night}`')
  expect(functionify('55')).toBe('55')
  expect(functionify('add(1, 2 === 2)')).toBe('add(1, 2 === 2)')
})
