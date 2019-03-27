import { wrtc } from './wrtc'
import { Action } from '../action'
import {
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE,
  WEBRTC_SOLICIT,
  SEND_TO_CONNECTION
} from '../constants'
import { DocStream } from '../doc-stream'

test('forward non wrtc actions to next middleware', () => {
  let passedAction: any
  const server: any = {}
  const next = (action: Action) => {
    passedAction = action
  }
  const action = new Action({ type: 'message' })
  const link = wrtc(server)(next)

  link(action)

  expect(passedAction.type).toBe('message')
})

test('do not forward wrtc actions to next middleware', () => {
  let passedAction: any
  const server: any = {
    getDoc: () => new DocStream('test')
  }
  const next = (action: Action) => {
    passedAction = action
  }
  const action = new Action({
    type: WEBRTC_OFFER,
    doc: 'fun',
    peerId: 'somebody'
  })
  const link = wrtc(server)(next)

  link(action)

  expect(passedAction).toBe(undefined)
})

test('send solicit to all members of a doc', () => {
  const server: any = {
    getDoc: () => new DocStream('test')
  }
  const next = () => { /* do nothing */ }
  const action = new Action({
    type: WEBRTC_SOLICIT,
    doc: 'fun'
  })
  const link = wrtc(server)(next)

  link(action)
})

test('send offer, answer, and candidates to specific connection', () => {
  const sent: string[] = []
  const doc = new DocStream('test')
  doc.join('user5')
  doc.on(SEND_TO_CONNECTION, (_connectionId: string, message: string) => {
    sent.push(message)
  })

  const server: any = {
    getDoc: () => doc
  }
  const next = () => { /* do nothing */ }
  const offerAction = new Action({
    type: WEBRTC_OFFER,
    doc: 'fun',
    peerId: 'user5'
  })
  const answerAction = new Action({
    type: WEBRTC_ANSWER,
    doc: 'fun',
    peerId: 'user5'
  })
  const candidateAction = new Action({
    type: WEBRTC_CANDIDATE,
    doc: 'fun',
    peerId: 'user5'
  })
  const link = wrtc(server)(next)

  link(offerAction)
  link(answerAction)
  link(candidateAction)

  expect(sent.length).toBe(3)
  expect(JSON.parse(sent[0]).type).toBe(WEBRTC_OFFER)
  expect(JSON.parse(sent[1]).type).toBe(WEBRTC_ANSWER)
  expect(JSON.parse(sent[2]).type).toBe(WEBRTC_CANDIDATE)
})
