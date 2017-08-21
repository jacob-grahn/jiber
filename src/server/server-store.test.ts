import { createServerStore } from './server-store'

test('it should make something, for sure', () => {
  const store = createServerStore()
  expect(store.getState()).toBeTruthy()
  expect(store.dispatch).toBeTruthy()
})
