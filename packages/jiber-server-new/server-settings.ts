import { DB } from 'jiber-core'
import * as WS from 'ws'

export interface ServerSettingsInput {
  db?: DB,
  initialState?: any
  verifyClient?: WS.VerifyClientCallbackAsync,
  maxDocAge?: number,
  port?: number,
  server?: any,
  snapshotInterval?: number,
}

export interface ServerSettings {
  db: DB,
  initialState: any,
  verifyClient: WS.VerifyClientCallbackAsync,
  maxDocAge: number,
  port: number,
  server: any,
  snapshotInterval: number
}
