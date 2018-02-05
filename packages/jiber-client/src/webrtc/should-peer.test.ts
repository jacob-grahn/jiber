import { SELF, PEER } from 'jiber-core'
import { shouldPeer } from './should-peer'

const state: any = {
  docs: {
    testDoc: {
      watchers: {
        nancy: {}
      }
    }
  }
}

test('peer messages from yourself', () => {
  const peerUserId = 'nancy'
  const action = { type: 'test', $src: SELF, $doc: 'testDoc' }
  expect(shouldPeer(state, peerUserId, action)).toBe(true)
})

test('do not peer messages from others', () => {
  const peerUserId = 'nancy'
  const action = { type: 'test', $src: PEER, $doc: 'testDoc' }
  expect(shouldPeer(state, peerUserId, action)).toBe(false)
})

test('do not peer messages if the peer is not in the target ', () => {
  const peerUserId = 'kevin'
  const action = { type: 'test', $src: SELF, $doc: 'testDoc' }
  expect(shouldPeer(state, peerUserId, action)).toBe(false)
})
