import { ServerSettings } from './interfaces/server-settings'
import { verifyClient } from './verify-client'
import { swiss } from './swiss'

export const defaultServerSettings: ServerSettings = {
  maxHistory: 1000,
  port: 8080,
  server: undefined,
  verifyClient,
  securityRules: [],
  reducer: swiss
}
