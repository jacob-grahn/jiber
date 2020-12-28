import { Action } from '../action'
import { JiberServer } from '../jiber-server'
import { OPEN, CLOSE, SERVER } from '../constants'

export const openAndClose = (server: JiberServer) => (next: Function) => (action: Action) => {
  if (action.type === 'SET_LOGIC') {
    console.log('openAndClose SET_LOGIC detected', action)
  }
  
  if (!action.doc) {
    return next(action)
  }

  let doc

  if (action.type === OPEN) {
    doc = server.getDoc(action.doc)
    doc.join(action.conn)
    next({
      type: 'SET',
      trust: SERVER,
      path: `$users.${action.user.userId}`,
      value: action.user
    })
  } else if (action.type === CLOSE) {
    doc = server.getDoc(action.doc)
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
