import { Action } from '../action'
import { JiberServer } from '../jiber-server'
import { OPEN, CLOSE, SERVER } from '../constants'

export const openAndClose = (server: JiberServer) => (next: Function) => (action: Action) => {
  const doc = server.getDoc(action.doc)
  if (action.type === OPEN) {
    doc.join(action.conn)
    next({
      type: 'SET',
      trust: SERVER,
      path: `$users.${action.user.userId}`,
      value: action.user
    })
  } else if (action.type === CLOSE) {
    doc.leave(action.conn)
    next({
      type: 'SET',
      trust: SERVER,
      path: `$users.${action.user.userId}`,
      value: null
    })
  } else {
    next(action)
  }
}
