import { ServerSettings } from './interfaces/server-settings'
import { verifyClient } from './verify-client'

export const defaultServerSettings: ServerSettings = {
  maxHistory: 1000,
  actionTtl: 1000 * 60 * 60 * 24, // one day
  port: 80,
  server: undefined,
  verifyClient
}
