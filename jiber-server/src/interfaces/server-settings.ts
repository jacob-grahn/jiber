import * as WS from 'ws'

type DocIDToNumber = (docId: string) => number

export interface ServerSettingsInput {
  actionTtl?: number | DocIDToNumber,
  maxHistory?: number | DocIDToNumber,
  port?: number,
  server?: any,
  verifyClient?: WS.VerifyClientCallbackAsync
}

export interface ServerSettings {
  actionTtl: number | DocIDToNumber,
  maxHistory: number | DocIDToNumber,
  port: number,
  server: any,
  verifyClient: WS.VerifyClientCallbackAsync
}
