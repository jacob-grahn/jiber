import { Action } from '../action'
import { DocStream } from '../doc-stream'
import { JiberServer } from '../jiber-server'

export const broadcast = (server: JiberServer) => (next: Function) => (action: Action) => {
  const docId: string = action.doc
  const doc: DocStream = server.docs[docId]
  const message = JSON.stringify(action)
  if (doc) {
    doc.addMessage(message)
  }
  next(action)
}
