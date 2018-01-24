import { SELF, PEER } from 'jiber-core'
import { shouldPeer } from './should-peer'

const state: any = {
  docs: {
    1: {
      watchers: {
        nancy: {}
      }
    }
  }
}

test('peer messages from yourself', () => {
  const peerUserId = 'nancy'
  const action = { type: 'test', $src: SELF, $doc: '1' }
  expect(shouldPeer(state, peerUserId, action)).toBe(true)
})

test('do not peer messages from others', () => {
  const peerUserId = 'nancy'
  const action = { type: 'test', $src: PEER, $doc: '1' }
  expect(shouldPeer(state, peerUserId, action)).toBe(false)
})

test('do not peer messages if the peer is not in the target ', () => {
  const peerUserId = 'kevin'
  const action = { type: 'test', $src: SELF, $doc: '1' }
  expect(shouldPeer(state, peerUserId, action)).toBe(false)
})
