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
  snapshotInterval: 1000
}

export default defaultSettings
