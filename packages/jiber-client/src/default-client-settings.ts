import { ClientSettings } from './interfaces/client-settings'
import { swiss, swissActionCreators } from './reducers/swiss'

/**
 * Default settings
 */
export const defaultClientSettings: ClientSettings = {
  reducer: swiss,
  middleware: [],
  url: undefined,
  stunServers: ['stun:stun.jiber.io'],
  credential: undefined,
  initialState: undefined,
  backoffMs: 5000,
  actionCreators: swissActionCreators,
  maxPeers: 10
}
