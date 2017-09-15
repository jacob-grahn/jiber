import { splice } from './splice'

test('do not modify the original array', () => {
  const arr = [1, 2, 3]
  splice(arr, 0, 1)
  expect(arr).toEqual([1, 2, 3])
})

test('does everyting a splicerman can do', () => {
  expect(splice(['a', 'b', 'c'], 1, 1)).toEqual(['a', 'c'])
  expect(splice([], 1, 0, 'f', 'g')).toEqual(['f', 'g'])
})
