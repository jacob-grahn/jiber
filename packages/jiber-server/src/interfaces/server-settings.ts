import { Reducer, DB } from 'jiber-core'
import { LoginRequestHandler } from './login-request-handler'

export interface ServerSettings {
  socketPort: number,
  stunPort: number,
  reducer: Reducer,
  login: LoginRequestHandler,
  db: DB,
  snapshotInterval: number,
  syncInterval: number,
  maxRoomAge: number,
  initialState: any
}
