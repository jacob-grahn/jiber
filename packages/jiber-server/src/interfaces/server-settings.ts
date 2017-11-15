import { Reducer, DB } from 'jiber-core'
import { LoginRequestHandler } from './login-request-handler'

export interface ServerSettings {
  socketPort: number,
  reducer: Reducer,
  login: LoginRequestHandler,
  db: DB,
  snapshotInterval: number,
  maxRoomAge: number,
  initialState: any
}
