import { Reducer } from '../../core/index'
import LoginRequestHandler from './login-request-handler'
import Storage from './storage'

interface ServerSettings {
  socketPort: number,
  stunPort: number,
  reducer: Reducer,
  onLogin: LoginRequestHandler,
  storage: Storage,
  rateLimitPeriodMs: number
  rateLimit: number,
  maxMessageCharLength: number
}

export default ServerSettings
