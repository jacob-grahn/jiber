import { Reducer, DB } from 'jiber-core'
import { LoginRequestHandler } from './login-request-handler'

export interface ServerSettingsInput {
  db?: DB,
  initialState?: any
  login?: LoginRequestHandler,
  maxDocAge?: number,
  port?: number,
  reducer?: Reducer,
  server?: any,
  snapshotInterval?: number,
}
