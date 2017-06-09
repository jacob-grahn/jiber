import createStore from './create-store'

test('it should provide a dispatch and getState method', () => {
  const store = createStore()
  expect(store.getState).toBeInstanceOf(Function)
  expect(store.dispatch).toBeInstanceOf(Function)
})
