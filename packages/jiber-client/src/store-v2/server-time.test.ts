/* global test, expect */

import { ServerTime } from './server-time'
const RealDateNow = Date.now

beforeEach(() => {
  const now = Date.now()
  Date.now = () => now
})

test('add offset to local time', () => {
  const st = new ServerTime()
  const localTime = Date.now()
  st.setTime(localTime + 10)
  expect(st.getTime()).toBe(localTime + 10)
})

afterEach(() => {
  Date.now = RealDateNow
})
