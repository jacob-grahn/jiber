import { Action } from '../action'
import { JiberServer } from '../jiber-server'
import { SERVER } from '../constants'

export const init = (_server: JiberServer) => (next: Function) => (action: Action) => {
  action.trust = SERVER
  action.time = Date.now()
  next(action)
}
