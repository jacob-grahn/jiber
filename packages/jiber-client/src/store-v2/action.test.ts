/* global test, expect */

import { Action } from './action'

test ('default values', () => {
  const action = new Action()
  expect(action.id).toBeTruthy()
  expect(action.trust).toBe(0)
  expect(action.time).toBe(0)
})

test ('set values', () => {
  const action = new Action({id: '5', trust: 3, time: 7})
  expect(action.id).toBe('5')
  expect(action.trust).toBe(3)
  expect(action.time).toBe(7)
})
