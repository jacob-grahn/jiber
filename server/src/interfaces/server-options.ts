import { Reducer } from '../../../core/index'
import LogInRequestHandler from './log-in-request-handler'
import Storage from './storage'

interface ServerOptions {
  webSocketPort?: number,
  stunPort?: number,
  reducer?: Reducer,
  onLogIn?: LogInRequestHandler,
  storage?: Storage,
  rateLimit?: {periodMs: number, max: number},
  maxMessageLength?: number
}

export { ServerOptions as default }
