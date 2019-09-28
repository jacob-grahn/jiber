import { Action } from '../action'
import { HiDBServer } from '../hidb-server'

export const broadcast = (server: HiDBServer) => (next: Function) => (action: Action) => {
  const doc = server.getDoc(action.doc)
  doc.addAction(action)
  next(action)
}
