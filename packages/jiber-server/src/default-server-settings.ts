import { ServerSettings } from './interfaces/server-settings'
import { verifyClient } from './verify-client'

export const defaultServerSettings: ServerSettings = {
  actionTtl: 1000 * 60 * 60, // one hour
  port: 80,
  server: undefined,
  verifyClient
}
