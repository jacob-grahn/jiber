import { runStr } from './run-str'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const ctx = {
  cities: [{
    name: 'London',
    population: 937272
  }],
  group: 'places'
}
const funcs = {
  add: (one: any, two: any) => one + two
}

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('double quote', () => {
  expect(runStr(funcs, ctx, '"test"')).toBe('test')
})

test('single quite', () => {
  expect(runStr(funcs, ctx, "'bloop'")).toBe('bloop')
})

test('interpolate', () => {
  expect(runStr(funcs, ctx, '`group: ${group}`')).toBe('group: places')
})

test('number', () => {
  expect(runStr(funcs, ctx, '555')).toBe(555)
})

test('variable path', () => {
  expect(runStr(funcs, ctx, 'cities.0.name')).toBe('London')
})

test('function', () => {
  expect(runStr(funcs, ctx, 'add(3, 4)')).toBe(7)
})

test('tie it all together', () => {
  expect(runStr(funcs, ctx, 'add( cities.0.population, add(1, 2) )'))
    .toBe(937275)
})
