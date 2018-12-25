/* global test, expect */

import { Peer } from './peer'
import { Packet } from '../packet'

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

    const peerA = new Peer('a', sendToServer, sendToStoreA)
    const peerB = new Peer('b', sendToServer, sendToStoreB)

    setTimeout(() => {
      peerA.send(new Packet({ payload: 'hi-peer-b' }))
    }, 1000)
  })
})
