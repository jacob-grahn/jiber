import { del } from './del'

test('deep paths work', () => {
  const user = { name: { first: 'sue' } }
  expect(del(user, 'name.first')).toEqual({ name: {} })
})

// Is it alright to live without this one?
/* test('non existant paths are ignored safely', () => {
  expect(del({}, 'name.first.wee')).toEqual({})
}) */

test('arrays should work', () => {
  const users = [{ name: 'bob' }, { name: 'sue' }]
  expect(del(users, '0.name')).toEqual([{}, { name: 'sue' }])
})

test('del index from middle of array', () => {
  const users = [0, 1, 2, 3]
  expect(del(users, '1')).toEqual([0, undefined, 2, 3])
})

test('del index from beginning of array', () => {
  const users = [0, 1, 2, 3]
  expect(del(users, '0')).toEqual([undefined, 1, 2, 3])
})

test('del index from end of array', () => {
  const users = [0, 1, 2, 3]
  expect(del(users, '3')).toEqual([0, 1, 2, undefined])
})

test('an empty path should delete the initial value', () => {
  expect(del('abc', '')).toEqual(undefined)
})
