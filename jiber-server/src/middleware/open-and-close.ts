import { Action } from '../action'
import { DocStream } from '../doc-stream'
import { JiberServer } from '../jiber-server'
import { OPEN, CLOSE, SEND_TO_CONNECTION } from '../constants'

export const openAndClose = (server: JiberServer) => (next: Function) => (action: Action) => {
  const docId: string = action.doc
  if (!server.docs[docId]) {
    server.docs[docId] = new DocStream()
    server.docs[docId].on(SEND_TO_CONNECTION, server.socketServer.send)
  }
  const doc: DocStream = server.docs[docId]
  if (action.type === OPEN) {
    doc.join(action.conn)
  } else if (action.type === CLOSE) {
    doc.leave(action.conn)
  } else {
    next(action)
  }
}
