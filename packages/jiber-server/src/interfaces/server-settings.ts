import * as WS from 'ws'

type ActionTtl = (docId: string) => number

export interface ServerSettingsInput {
  actionTtl?: number | ActionTtl,
  port?: number,
  server?: any,
  verifyClient?: WS.VerifyClientCallbackAsync
}

export interface ServerSettings {
  actionTtl: number | ActionTtl,
  port: number,
  server: any,
  verifyClient: WS.VerifyClientCallbackAsync
}
