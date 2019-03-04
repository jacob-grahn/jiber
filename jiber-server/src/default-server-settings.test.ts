/* global test, expect */

import { defaultServerSettings } from './default-server-settings'

test('export a settings object', () => {
  expect(typeof defaultServerSettings).toBe('object')
})
