/* global test, expect */

import { Peer } from './peer'
import { Packet } from '../packet'
import { WEBRTC_SOLICIT } from '../constants'

test('send a message from one peer to another', () => {
  return new Promise((resolve) => {
    const peers: {[key: string]: Peer} = {}

    const sendToServer = (packet: Packet) => {
      const peer = peers[packet.payload.peerId]
      peer.receiveFromServer(packet).catch(console.log)
    }

    const sendToStoreA = () => { /* do nothing */ }
    const sendToStoreB = (packet: Packet) => {
      expect(packet.payload).toBe('hi-peer-b')
      resolve()
    }

    const peerA = new Peer('b', sendToServer, sendToStoreA)
    const peerB = new Peer('a', sendToServer, sendToStoreB)
    peers['a'] = peerA
    peers['b'] = peerB

    peerA.receiveFromServer(new Packet({ type: WEBRTC_SOLICIT }))
      .catch(console.log)

    setTimeout(() => {
      peerA.send(new Packet({ payload: 'hi-peer-b' }))
    }, 1000)
  })
})
