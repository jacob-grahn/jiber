import { Action } from '../action'
import { JiberServer } from '../jiber-server'
import {
  WEBRTC_SOLICIT,
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE,
  SERVER
} from '../constants'

const WRTC_TYPES = [
  WEBRTC_SOLICIT,
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE
]

export const wrtc = (server: JiberServer) => (next: Function) => (action: Action) => {
  if (action.type && WRTC_TYPES.indexOf(action.type) !== -1) {
    const doc = server.getDoc(action.doc)
    const replyAction = new Action({
      type: action.type,
      trust: SERVER,
      doc: action.doc,
      peerId: action.conn,
      offer: action.offer,
      answer: action.answer,
      candidate: action.candidate
    })

    if (action.type === WEBRTC_SOLICIT) {
      doc.sendToOtherMembers(action.conn, JSON.stringify(replyAction))
    } else {
      doc.sendToMember(action.peerId || '', JSON.stringify(replyAction))
    }
  } else {
    next(action)
  }
}
