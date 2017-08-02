import { simpleSetter } from '../core/index'
import memStorage from './storage/mem-storage'
import memAccounts from './accounts/mem-accounts'
import ServerSettings from './interfaces/server-settings'

const defaultSettings: ServerSettings = {
  socketPort: 80,
  stunPort: 3478,
  reducer: simpleSetter,
  onLogin: memAccounts,
  storage: memStorage,
  snapshotInterval: 5000,                                                       // five seconds
  syncInterval: 1000,                                                           // one second
  maxRoomAge: 1000 * 60 * 60                                                    // one hour
}

export default defaultSettings
