import { ClientSettings } from './interfaces/client-settings'
import { swiss } from '../core/index'

/**
 * Default settings
 */
export const defaultClientSettings: ClientSettings = {
  reducer: swiss,
  middleware: [],
  url: '',
  stunPort: 3478,                                                               // 5349 for TLS
  socketPort: 80,
  credential: undefined,
  initialState: undefined,
  backoffMs: 5000
}
