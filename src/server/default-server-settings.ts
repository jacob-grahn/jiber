import { memStorage } from './storage/mem-storage'
import { memAccounts } from './accounts/mem-accounts'
import { ServerSettings } from './interfaces/server-settings'

export const defaultServerSettings: ServerSettings = {
  socketPort: 80,
  stunPort: 3478,
  reducer: (state, action) => { return {...state, ...action} },
  onLogin: memAccounts,
  storage: memStorage,
  snapshotInterval: 5000,                                                       // five seconds
  syncInterval: 1000,                                                           // one second
  maxRoomAge: 1000 * 60 * 60                                                    // one hour
}
