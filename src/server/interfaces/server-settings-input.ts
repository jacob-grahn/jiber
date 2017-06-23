import { Reducer } from '../../core/index'
import LoginRequestHandler from './login-request-handler'
import Storage from './storage'

interface ServerSettingsInput {
  socketPort?: number,
  stunPort?: number,
  reducer?: Reducer,
  onLogin?: LoginRequestHandler,
  storage?: Storage,
  initialState?: any
}

export default ServerSettingsInput
