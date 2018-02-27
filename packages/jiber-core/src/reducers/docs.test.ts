import { docs } from './docs'

test('use supplied reducer', () => {
  const subReducer = (_state: any, action: any) => action.type
  const reducer = docs(subReducer)
  const action = { type: 'air', $docId: 'element' }
  const state = reducer(undefined, action)
  expect(state).toEqual({ element: 'air' })
})
