import { ServerSettings } from './interfaces/server-settings'
import { verifyClient } from './verify-client'
import { logic } from './logic'

export const defaultServerSettings: ServerSettings = {
  port: 8080,
  server: undefined,
  verifyClient,
  securityRules: [],
  reducer: logic,
  middleware: []
}
