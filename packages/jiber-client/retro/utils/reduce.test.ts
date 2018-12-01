import { reduce } from './reduce'

test('reduce with an object', () => {
  const obj = { a: 1, b: 2, c: 3 }
  const result = reduce(obj, (total, value) => total += value, 10)
  expect(result).toBe(16)
})

test('reduce with an array', () => {
  const arr = ['la', 'de', 'da']
  const result = reduce(arr, (total, value) => total += value, 'fo')
  expect(result).toBe('foladeda')
})
