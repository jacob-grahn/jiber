import { Reducer, DB } from 'jiber-core'
import { LoginRequestHandler } from './login-request-handler'

export interface ServerSettingsInput {
  socketPort?: number,
  stunPort?: number,
  reducer?: Reducer,
  onLogin?: LoginRequestHandler,
  db?: DB,
  snapshotInterval?: number,
  syncInterval?: number,
  maxRoomAge?: number,
  initialState?: any
}
