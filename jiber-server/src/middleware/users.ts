import { Action } from '../action'
import { JiberServer } from '../jiber-server'
import { OPEN, CLOSE, SERVER } from '../constants'

export const users = (_server: JiberServer) => (next: Function) => (action: Action) => {
  if (action.type === OPEN) {
    next(action)
    next({
      type: 'SET',
      trust: SERVER,
      path: `$users.${action.user.id}`,
      value: action.user
    })
  } else if (action.type === CLOSE) {
    next({
      type: 'SET',
      trust: SERVER,
      path: `$users.${action.user.id}`,
      value: null
    })
    next(action)
  } else {
    next(action)
  }
}
