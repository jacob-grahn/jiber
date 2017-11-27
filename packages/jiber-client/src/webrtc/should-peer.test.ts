import { SELF, PEER } from 'jiber-core'
import { shouldPeer } from './should-peer'

const state: any = {
  rooms: {
    room1: {
      members: {
        nancy: {}
      }
    }
  }
}

test('peer messages from yourself', () => {
  const peerUserId = 'nancy'
  const action = { type: 'test', $source: SELF, $roomId: 'room1' }
  expect(shouldPeer(state, peerUserId, action)).toBe(true)
})

test('do not peer messages from others', () => {
  const peerUserId = 'nancy'
  const action = { type: 'test', $source: PEER, $roomId: 'room1' }
  expect(shouldPeer(state, peerUserId, action)).toBe(false)
})

test('do not peer messages if the peer is not in the target room', () => {
  const peerUserId = 'kevin'
  const action = { type: 'test', $source: SELF, $roomId: 'room1' }
  expect(shouldPeer(state, peerUserId, action)).toBe(false)
})
