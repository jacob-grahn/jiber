import { Reducer } from '../../core/index'
import LoginRequestHandler from './login-request-handler'
import Storage from './storage'

export interface ServerOptions {
  socketPort?: number,
  stunPort?: number,
  reducer?: Reducer,
  onLogin?: LoginRequestHandler,
  storage?: Storage,
  rateLimitPeriodMs?: number
  rateLimit?: number,
  maxMessageCharLength?: number,
  initialState?: any
}
