import { memoryDB } from './memory-db/memory-db'
import { memAccounts } from './accounts/mem-accounts'
import { ServerSettings } from './interfaces/server-settings'
import { patcher } from 'jiber-core'

export const defaultServerSettings: ServerSettings = {
  db: memoryDB,
  initialState: undefined,
  login: memAccounts,
  maxRoomAge: 1000 * 60 * 60,                                                   // one hour
  port: 80,
  reducer: patcher,
  snapshotInterval: 5000,                                                       // five seconds
  server: undefined
}
