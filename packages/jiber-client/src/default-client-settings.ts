import { ClientSettings } from './interfaces/client-settings'
import { swiss, swissActionCreators } from 'jiber-core'

/**
 * Default settings
 */
export const defaultClientSettings: ClientSettings = {
  reducer: swiss,
  middleware: [],
  url: '',
  stunServers: [],
  socketPort: 80,
  credential: undefined,
  initialState: undefined,
  backoffMs: 5000,
  actionCreators: swissActionCreators
}
