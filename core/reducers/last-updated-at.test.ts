import { lastUpdatedAt } from './last-updated-at'

test('update if $timeMs exists', () => {
  expect(lastUpdatedAt(0, {type: 'cool', $timeMs: 5}))
    .toBe(5)
})

test('do not update if $timeMs does not exist', () => {
  expect(lastUpdatedAt(0, {type: 'cool'}))
    .toBe(0)
})
