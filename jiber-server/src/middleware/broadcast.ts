import { Packet } from '../packet'
import { DocStream } from '../doc-stream'
import { JiberServer } from '../jiber-server'

export const broadcast = (server: JiberServer) => (next: Function) => (packet: Packet) => {
  const docId: string = packet.doc
  const doc: DocStream = server.docs[docId]
  const message = JSON.stringify(packet)
  if (doc) {
    doc.addMessage(message)
  }
  next(packet)
}
