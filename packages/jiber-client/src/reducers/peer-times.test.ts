import { SERVER } from '../constants'
import { peerTimes } from './peer-times'

test('record time if action came from the server', () => {
  const action = { type: 'test', $userId: 'sue', $madeAt: 5, $source: SERVER }
  const state = peerTimes(undefined, action)
  expect(state).toEqual({ sue: 5 })
})

test('do not record time if action came from LOCAL or PEER', () => {
  const action = { type: 'test', $userId: 'sue', $madeAt: 5, $source: 'THE_MOON' }
  const state = peerTimes(undefined, action)
  expect(state).toEqual({})
})
