/* global test, expect */

import { Peer } from './peer'
import { Packet } from '../packet'
import { WEBRTC_SOLICIT } from '../constants'

test('send a message from one peer to another', () => {
  return new Promise((resolve) => {
    const sendToServer = (packet: Packet) => {
      if (packet.payload.peerId === 'a') {
        peerA.receiveFromServer(packet)
      }
      if (packet.payload.peerId === 'b') {
        peerB.receiveFromServer(packet)
      }
    }

    const sendToStoreA = () => {}
    const sendToStoreB = (packet: Packet) => {
      expect(packet.payload).toBe('hi-peer-b')
      resolve()
    }

    const peerA = new Peer('b', sendToServer, sendToStoreA)
    const peerB = new Peer('a', sendToServer, sendToStoreB)

    peerA.receiveFromServer(new Packet({ type: WEBRTC_SOLICIT }))

    setTimeout(() => {
      peerA.send(new Packet({ payload: 'hi-peer-b' }))
    }, 1000)
  })
})
