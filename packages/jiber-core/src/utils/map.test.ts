import { map } from './map'

test('map an array, for what it\'s worth', () => {
  const arr = [1, 2, 3]
  const results = map(arr, (val: number) => val * 2)
  expect(results).toEqual({
    '0': 2,
    '1': 4,
    '2': 6
  })
})

test('map an object', () => {
  const obj = { title: 'Journey', length: 55 }
  const results = map(obj, (val: string | number) => val + ' yay')
  expect(results).toEqual({ title: 'Journey yay', length: '55 yay' })
})
