import { defaultSettings } from './default-settings'

test('export a host and port', () => {
  expect(defaultSettings.host).toBeTruthy()
  expect(defaultSettings.port).toBeTruthy()
})
