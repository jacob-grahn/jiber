import { defaultServerSettings } from './default-server-settings'

test('make some nice defaults', () => {
  expect(defaultServerSettings.socketPort).toBeTruthy()
})
