import map from './map'

test('map an array', () => {
  const arr = [1, 2, 3]
  const results = map(arr, (val: number) => val * 2)
  expect(results).toEqual([2, 4, 6])
})

test('map an object', () => {
  const obj = {title: 'Journey', length: 55}
  const results = map(obj, (val: string|number) => val + ' yay')
  expect(results).toEqual({title: 'Journey yay', length: '55 yay'})
})
