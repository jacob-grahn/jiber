import createClientStore from './create-client-store'

test('it should make a working client store', () => {
  const clientStore = createClientStore()
  expect(clientStore).toBeTruthy()
  expect(clientStore.getState()).toBeTruthy()
  expect(clientStore.createRoom('room1')).toBeTruthy()
  expect(clientStore.dispatch({type: 'test'})).toBeUndefined()
})
