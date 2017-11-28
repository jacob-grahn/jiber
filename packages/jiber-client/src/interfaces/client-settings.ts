import { Reducer, Middleware } from 'jiber-core'

/**
 * The settings passed in will have their gaps filled with defaults
 * to create an object that always confirms to this interface
 */
export interface ClientSettings {
  actionCreators: {[key: string]: Function},
  backoffMs: number,
  credential?: string
  initialState: any,
  maxPeers: number,
  middleware: Array<Middleware>,
  reducer: Reducer,
  stunServers: string[],
  url?: string
}
