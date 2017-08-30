import { ClientSettings } from './interfaces/client-settings'

export const defaultClientSettings: ClientSettings = {
  reducer: (state, action) => { return {...state, ...action} },
  middleware: [],
  url: '',
  stunPort: 3478,                                                               // 5349 for TLS
  socketPort: 80,
  credential: '',
  initialState: undefined,
  backoffMs: 5000
}
