/* global test, expect, beforeEach, afterEach */

import { uuidv4 } from './uuidv4'

test ('make a different uuid every time', () => {
  expect(uuidv4()).not.toEqual(uuidv4())
})

test ('match the uuidv4 spec', () => {
  const uuid = uuidv4()
  expect(uuid.length).toBe(40)
  expect(uuid.charAt(14)).toBe('4')
})
