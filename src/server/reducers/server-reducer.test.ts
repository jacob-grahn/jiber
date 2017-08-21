import { createServerReducer } from './server-reducer'

const identity = (state: any) => state

test('make a reducer to handle server state', () => {
  const reducer = createServerReducer(identity)
  const state = reducer(undefined, {type: 'whatev'})
  expect(state).toEqual({rooms: {}, sockets: {}, users: {}})
})
