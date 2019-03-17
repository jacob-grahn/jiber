import * as WS from 'ws'

type DocIDToNumber = (docId: string) => number

export interface ServerSettingsInput {
  maxHistory?: number | DocIDToNumber,
  port?: number,
  server?: any,
  verifyClient?: WS.VerifyClientCallbackAsync
}

export interface ServerSettings {
  maxHistory: number | DocIDToNumber,
  port: number,
  server: any,
  verifyClient: WS.VerifyClientCallbackAsync
}
