import * as WS from 'ws'
import { SecurityRule } from '../middleware/security-rules'
import { Reducer } from './reducer'

export interface ServerSettingsInput {
  port?: number,
  server?: any,
  verifyClient?: WS.VerifyClientCallbackAsync,
  securityRules?: SecurityRule[],
  reducer?: Reducer
}

export interface ServerSettings {
  port: number,
  server: any,
  verifyClient: WS.VerifyClientCallbackAsync
  securityRules: SecurityRule[],
  reducer: Reducer
}
