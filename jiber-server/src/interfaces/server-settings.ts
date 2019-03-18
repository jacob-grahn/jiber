import * as WS from 'ws'
import { SecurityRule } from '../middleware/security-rules'

type DocIDToNumber = (docId: string) => number

export interface ServerSettingsInput {
  maxHistory?: number | DocIDToNumber,
  port?: number,
  server?: any,
  verifyClient?: WS.VerifyClientCallbackAsync,
  securityRules?: SecurityRule[]
}

export interface ServerSettings {
  maxHistory: number | DocIDToNumber,
  port: number,
  server: any,
  verifyClient: WS.VerifyClientCallbackAsync
  securityRules: SecurityRule[]
}
