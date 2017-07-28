import lastUpdatedAt from './last-updated-at'
import {
  CONFIRMED_STATE,
  CONFIRM_ACTION,
  PATCH
} from '../constants/action-types'

test('update on CONFIRMED_STATE', () => {
  expect(lastUpdatedAt(0, {type: CONFIRMED_STATE, lastUpdatedAt: 5}))
    .toBe(5)
})

test('update on CONFIRM_ACTION', () => {
  expect(lastUpdatedAt(0, {type: CONFIRM_ACTION, $hope: {timeMs: 5}}))
    .toBe(5)
})

test('update on PATCH', () => {
  expect(lastUpdatedAt(0, {type: PATCH, lastUpdatedAt: 5}))
    .toBe(5)
})
