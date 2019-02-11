import { Packet } from '../packet'
import { DocStream } from '../doc-stream'
import {
  WEBRTC_SOLICIT,
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE
} from '../constants'

const WRTC_TYPES = [
  WEBRTC_SOLICIT,
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE
]

export const wrtc = (server: any) => (next: Function) => (packet: Packet) => {
  if (packet.type && WRTC_TYPES.indexOf(packet.type) !== -1) {
    const docId = packet.doc
    const doc: DocStream = server.docs[docId]
    if (packet.type === WEBRTC_SOLICIT) {
      doc.sendToMembers(JSON.stringify(packet))
    } else {
      doc.sendToMember(packet.payload.peerId, JSON.stringify(packet))
    }
  } else {
    next(packet)
  }
}
