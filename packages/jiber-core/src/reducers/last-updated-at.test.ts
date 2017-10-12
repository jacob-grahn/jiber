import { lastUpdatedAt } from './last-updated-at'

test('update if $t exists', () => {
  expect(lastUpdatedAt(0, {type: 'cool', $t: 5}))
    .toBe(5)
})

test('do not update if $t does not exist', () => {
  expect(lastUpdatedAt(0, {type: 'cool'}))
    .toBe(0)
})
