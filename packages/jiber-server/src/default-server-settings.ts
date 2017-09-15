// todo: I think it would look nicer if onLogin was just login

import { memoryDB } from './memory-db/memory-db'
import { memAccounts } from './accounts/mem-accounts'
import { ServerSettings } from './interfaces/server-settings'
import { swiss } from 'jiber-core'

export const defaultServerSettings: ServerSettings = {
  socketPort: 80,
  stunPort: 3478,
  reducer: swiss,
  onLogin: memAccounts,
  db: memoryDB,
  snapshotInterval: 5000,                                                       // five seconds
  syncInterval: 1000,                                                           // one second
  maxRoomAge: 1000 * 60 * 60,                                                   // one hour
  initialState: undefined
}
