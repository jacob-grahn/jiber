import { Reducer } from './reducer'
import { Middleware } from './middleware'
import { ActionCreators } from './action-creators'

/**
 * The potential options that can be passed in when creating
 * a client store
 */
export interface ClientSettingsInput {
  credential?: string
  middleware?: Array<Middleware>,
  reducer?: Reducer,
  url?: string,
  stunServers?: string[],
  initialState?: any,
  backoffMs?: number,
  actionCreators?: ActionCreators,
  maxPeers?: number
}
