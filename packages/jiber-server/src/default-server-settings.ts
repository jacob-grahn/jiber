import { memoryDB } from './memory-db/memory-db'
import { memAccounts } from './accounts/mem-accounts'
import { ServerSettings } from './interfaces/server-settings'
import { patcher } from 'jiber-core'

export const defaultServerSettings: ServerSettings = {
  socketPort: 80,
  reducer: patcher,
  login: memAccounts,
  db: memoryDB,
  snapshotInterval: 5000,                                                       // five seconds
  maxRoomAge: 1000 * 60 * 60,                                                   // one hour
  initialState: undefined
}
