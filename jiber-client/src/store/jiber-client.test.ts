/* global test, expect */

import { JiberClient } from './jiber-client'

test('it should provide a createDoc method', () => {
  const jiber = new JiberClient()
  expect(jiber.createDoc).toBeTruthy()
})
