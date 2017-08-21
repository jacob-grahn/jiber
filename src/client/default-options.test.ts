import { defaultOptions } from './default-options'

test('it should return something', () => {
  expect(Object.keys(defaultOptions).length).toBeGreaterThan(0)
})
