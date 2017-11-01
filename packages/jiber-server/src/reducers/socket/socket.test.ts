import { INIT_SOCKET } from 'jiber-core'
import { socket } from './socket'

test('should store ws and userId', () => {
  const state = socket(undefined, { type: INIT_SOCKET, ws: 'hi' })
  expect(state).toEqual({
    ws: 'hi',
    userId: undefined
  })
})
