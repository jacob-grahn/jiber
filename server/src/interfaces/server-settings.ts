import { Reducer } from '../core'
import { LoginRequestHandler } from './login-request-handler'
import { Storage } from './storage'

export interface ServerSettings {
  socketPort: number,
  stunPort: number,
  reducer: Reducer,
  onLogin: LoginRequestHandler,
  storage: Storage,
  snapshotInterval: number,
  syncInterval: number,
  maxRoomAge: number,
  initialState: any
}
