import { Packet } from '../packet'
import { DocStream } from '../doc-stream'
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

export const wrtc = (server: JiberServer) => (next: Function) => (packet: Packet) => {
  if (packet.type && WRTC_TYPES.indexOf(packet.type) !== -1) {
    const docId = packet.doc
    const doc: DocStream = server.docs[docId]
    if (!doc) return

    const replyPacket = new Packet({
      type: packet.type,
      payload: { ...packet.payload } || {},
      trust: SERVER,
      doc: packet.doc
    })
    replyPacket.payload.peerId = packet.conn

    if (packet.type === WEBRTC_SOLICIT) {
      doc.sendToMembers(JSON.stringify(replyPacket))
    } else {
      doc.sendToMember(packet.payload.peerId, JSON.stringify(replyPacket))
    }
  } else {
    next(packet)
  }
}
