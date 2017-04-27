import { Reducer } from '../../core'
import LogInRequestHandler from './log-in-request-handler'
import Storage from './storage'

interface ServerOptions {
  webSocketPort?: number,
  stunPort?: number,
  reducer?: Reducer,
  onLogIn?: LogInRequestHandler,
  storage?: Storage
}

export { ServerOptions as default }
