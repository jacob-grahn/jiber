/* global test, expect */

import { Peer } from './peer'
import { Action } from '../action'
import { WEBRTC_SOLICIT } from '../constants'

test('send a message from one peer to another', () => {
  return new Promise((resolve) => {
    const peers: {[key: string]: Peer} = {}

    const sendToServer = (action: Action) => {
      if (!action.peerId) return
      const peer = peers[action.peerId]
      peer.receiveFromServer(action).catch(console.log)
    }

    const sendToStoreA = () => { /* do nothing */ }
    const sendToStoreB = (action: Action) => {
      expect(action.type).toBe('hi-peer-b')
      peerA.close()
      peerB.close()
      resolve()
    }

    const peerA = new Peer('default', 'b', sendToServer, sendToStoreA)
    const peerB = new Peer('default', 'a', sendToServer, sendToStoreB)
    peers['a'] = peerA
    peers['b'] = peerB

    peerA.receiveFromServer(new Action({ type: WEBRTC_SOLICIT }))
      .catch(console.log)

    setTimeout(() => {
      peerA.send(new Action({ type: 'hi-peer-b' }))
    }, 1000)
  })
})
