import { ServerSettings } from './interfaces/server-settings'
import { verifyClient } from './verify-client'

export const defaultServerSettings: ServerSettings = {
  maxHistory: 1000,
  port: 8080,
  server: undefined,
  verifyClient,
  securityRules: []
}
