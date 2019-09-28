import { Action } from '../action'
import { HiDBServer } from '../hidb-server'
import { SERVER } from '../constants'

export const init = (_server: HiDBServer) => (next: Function) => (action: Action) => {
  action.trust = SERVER
  action.time = Date.now()
  next(action)
}
