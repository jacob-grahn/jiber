import { Negotiator } from './negotiator'
import {
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE
} from 'jiber-core'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const pc: any = {
  setRemoteDescription: async (offer: any) => {
    calls.push(['setRemoteDescription', offer])
  },
  setLocalDescription: async (desc: any) => {
    calls.push(['setLocalDescription', desc])
  },
  addIceCandidate: (candidate: any) => {
    calls.push(['addIceCandidate', candidate])
  },
  createAnswer: async () => 'LOCAL_ANSWER',
  createOffer: async () => 'LOCAL_OFFER'
}
const dispatch = (action: any) => calls.push(['dispatch', action])

beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('accept initial offer', async () => {
  const peerUserId = 'susan'
  const offer = 'REMOTE_DESC'
  const negotiator = new Negotiator(dispatch, pc, peerUserId, offer)

  await Promise.resolve()
  await Promise.resolve()
  await Promise.resolve()

  expect(negotiator).toBeTruthy()
  expect(calls).toEqual([
    ['setRemoteDescription', 'REMOTE_DESC'],
    ['setLocalDescription', 'LOCAL_ANSWER'],
    ['dispatch', {
      type: WEBRTC_ANSWER,
      answer: 'LOCAL_ANSWER',
      peerUserId: 'susan'
    }]
  ])
})

test('receive an answer', async () => {
  const peerUserId = 'susan'
  const negotiator = new Negotiator(dispatch, pc, peerUserId)
  const action = {
    type: WEBRTC_ANSWER,
    answer: 'LALA',
    $confirmed: true,
    $uid: 'susan'
  }

  await Promise.resolve()
  await Promise.resolve()
  await negotiator.onAction(action)

  expect(calls[2]).toEqual(['setRemoteDescription', 'LALA'])
})

test('receive an ICE candidate', async () => {
  const peerUserId = 'susan'
  const negotiator = new Negotiator(dispatch, pc, peerUserId)
  const action = {
    type: WEBRTC_CANDIDATE,
    candidate: 'MEME',
    $confirmed: true,
    $uid: 'susan'
  }

  await Promise.resolve()
  await Promise.resolve()
  await negotiator.onAction(action)

  expect(calls[2]).toEqual(['addIceCandidate', 'MEME'])
})
