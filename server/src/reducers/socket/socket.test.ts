import { socket } from './socket'

test('should combine some reducers', () => {
  const state = socket(undefined, {type: 'wee'})
  expect(state).toEqual({
    connectedAt: 0,
    connection: undefined,
    userId: ''
  })
})
