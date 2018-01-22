import { createClientStore } from './client-store'

test('it should make a working client store', () => {
  const clientStore = createClientStore()
  expect(clientStore).toBeTruthy()
  expect(clientStore.getState()).toBeTruthy()
  expect(clientStore.createDoc('1')).toBeTruthy()
  expect(clientStore.dispatch({ type: 'test' })).toBeUndefined()
})
