import { toArray } from './to-array'

test('undefined become an empty array', () => {
  expect(toArray(undefined)).toEqual([])
})

test('non-array values are wrapped in an array', () => {
  expect(toArray(0)).toEqual([0])
  expect(toArray(false)).toEqual([false])
  expect(toArray('hi')).toEqual(['hi'])
  expect(toArray(null)).toEqual([null])
  expect(toArray({})).toEqual([{}])
})

test('arrays are just returned', () => {
  expect(toArray(['yo'])).toEqual(['yo'])
})
