import { createStore } from './create-store'
import Reducer from './interfaces/reducer'

const nameReducer: Reducer = (state = '', action) => action.name || state

test('it should provide a dispatch and getState method', () => {
  const store = createStore(nameReducer)
  expect(store.getState).toBeTruthy()
  expect(store.dispatch).toBeTruthy()
})
