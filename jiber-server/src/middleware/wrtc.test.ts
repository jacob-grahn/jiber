import { wrtc } from './wrtc'
import { Packet } from '../packet'
import {
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE,
  WEBRTC_SOLICIT,
  SEND_TO_CONNECTION
} from '../constants'
import { DocStream } from '../doc-stream'

test('forward non wrtc packets to next middleware', () => {
  let passedPacket: any
  const server = {}
  const next = (packet: Packet) => {
    passedPacket = packet
  }
  const packet = new Packet({ type: 'message' })
  const link = wrtc(server)(next)

  link(packet)

  expect(passedPacket.type).toBe('message')
})

test('do not forward wrtc packets to next middleware', () => {
  let passedPacket: any
  const server = {
    docs: {
      fun: new DocStream()
    }
  }
  const next = (packet: Packet) => {
    passedPacket = packet
  }
  const packet = new Packet({
    type: WEBRTC_OFFER,
    doc: 'fun',
    payload: { peerId: 'somebody' }
  })
  const link = wrtc(server)(next)

  link(packet)

  expect(passedPacket).toBe(undefined)
})

test('send solicit to all members of a doc', () => {
  const server = {
    docs: {
      fun: new DocStream()
    }
  }
  const next = () => { /* do nothing */ }
  const packet = new Packet({
    type: WEBRTC_SOLICIT,
    doc: 'fun'
  })
  const link = wrtc(server)(next)

  link(packet)
})

test('send offer, answer, and candidates to specific connection', () => {
  const sent: string[] = []
  const doc = new DocStream()
  doc.join('user5')
  doc.on(SEND_TO_CONNECTION, (_connectionId: string, message: string) => {
    sent.push(message)
  })

  const server = {
    docs: {
      fun: doc
    }
  }
  const next = () => { /* do nothing */ }
  const offerPacket = new Packet({
    type: WEBRTC_OFFER,
    doc: 'fun',
    payload: { peerId: 'user5' }
  })
  const answerPacket = new Packet({
    type: WEBRTC_ANSWER,
    doc: 'fun',
    payload: { peerId: 'user5' }
  })
  const candidatePacket = new Packet({
    type: WEBRTC_CANDIDATE,
    doc: 'fun',
    payload: { peerId: 'user5' }
  })
  const link = wrtc(server)(next)

  link(offerPacket)
  link(answerPacket)
  link(candidatePacket)

  expect(sent.length).toBe(3)
  expect(JSON.parse(sent[0]).type).toBe(WEBRTC_OFFER)
  expect(JSON.parse(sent[1]).type).toBe(WEBRTC_ANSWER)
  expect(JSON.parse(sent[2]).type).toBe(WEBRTC_CANDIDATE)
})
