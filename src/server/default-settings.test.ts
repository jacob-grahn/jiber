import defaultSettings from './default-settings'

test('make some nice defaults', () => {
  expect(defaultSettings.socketPort).toBeTruthy()
})
