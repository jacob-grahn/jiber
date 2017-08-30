import { defaultClientSettings } from './default-client-settings'

test('it should return something', () => {
  expect(Object.keys(defaultClientSettings).length).toBeGreaterThan(0)
})
