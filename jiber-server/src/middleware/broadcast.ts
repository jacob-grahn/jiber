import { Action } from '../action'
import { JiberServer } from '../jiber-server'

export const broadcast = (server: JiberServer) => (next: Function) => (action: Action) => {
  const doc = server.getDoc(action.doc)
  const message = JSON.stringify(action)
  if (doc) {
    doc.addMessage(message)
  }
  next(action)
}
