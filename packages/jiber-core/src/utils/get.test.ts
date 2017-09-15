import { get } from './get'

test('non object or array input values result in undefined', () => {
  expect(get(undefined, 'something')).toBe(undefined)
  expect(get(null, 'something')).toBe(undefined)
  expect(get(true, 'something')).toBe(undefined)
  expect(get(false, 'something')).toBe(undefined)
  expect(get('', 'something')).toBe(undefined)
})

test('deep paths work', () => {
  const user = {name: {first: 'sue', last: 'per', age: null}}
  expect(get(user, 'name.first')).toBe('sue')
  expect(get(user, 'name.age')).toBe(null)
})

test('bad paths don\'t throw an error, they just return undefined', () => {
  expect(get({}, 'name.first.wee')).toBe(undefined)
})

test('arrays should work', () => {
  const users = [{name: 'bob'}, {name: 'sue'}]
  expect(get(users, '0.name')).toBe('bob')
})

test('an empty path should return the initial value', () => {
  expect(get('abc')).toEqual('abc')
})
