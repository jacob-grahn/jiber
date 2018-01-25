import { forEach } from './for-each'

test('forEach an array', () => {
  const arr = [1, 2, 3]
  const results: any[] = []
  forEach(arr, (val: number, key: string) => results.push({ val, key }))
  expect(results).toEqual([
    { key: '0', val: 1 },
    { key: '1', val: 2 },
    { key: '2', val: 3 }
  ])
})

test('forEach an object', () => {
  const obj = { title: 'Journey', length: 55 }
  const results: any[] = []
  forEach(obj, (val: any, key: any) => results.push({ val, key }))
  expect(results).toEqual([
    { key: 'title', val: 'Journey' },
    { key: 'length', val: 55 }
  ])
})

test('survive a falsy input without throwing an error', () => {
  forEach(undefined, () => { /* do nothing */ })
})
