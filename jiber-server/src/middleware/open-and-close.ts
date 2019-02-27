import { Packet } from '../packet'
import { DocStream } from '../doc-stream'
import { JiberServer } from '../jiber-server'
import { OPEN, CLOSE, SEND_TO_CONNECTION } from '../constants'

export const openAndClose = (server: JiberServer) => (next: Function) => (packet: Packet) => {
  const docId: string = packet.doc
  if (!server.docs[docId]) {
    server.docs[docId] = new DocStream()
    server.docs[docId].on(SEND_TO_CONNECTION, server.socketServer.send)
  }
  const doc: DocStream = server.docs[docId]
  if (packet.type === OPEN) {
    doc.join(packet.conn)
  } else if (packet.type === CLOSE) {
    doc.leave(packet.conn)
  } else {
    next(packet)
  }
}
