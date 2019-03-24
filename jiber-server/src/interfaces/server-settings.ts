import * as WS from 'ws'
import { SecurityRule } from '../middleware/security-rules'
import { Reducer } from './reducer'

export interface ServerSettingsInput {
  maxHistory?: number,
  port?: number,
  server?: any,
  verifyClient?: WS.VerifyClientCallbackAsync,
  securityRules?: SecurityRule[],
  reducer?: Reducer
}

export interface ServerSettings {
  maxHistory: number,
  port: number,
  server: any,
  verifyClient: WS.VerifyClientCallbackAsync
  securityRules: SecurityRule[],
  reducer: Reducer
}
