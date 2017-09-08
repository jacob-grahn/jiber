import { Reducer, Middleware } from '../../core/index'

/**
 * The potential options that can be passed in when creating
 * a client store
 */
export interface ClientSettingsInput {
  credential?: string
  middleware?: Array<Middleware>,
  reducer?: Reducer,
  url?: string,
  socketPort?: number,
  stunPort?: number,
  initialState?: any,
  backoffMs?: number
}
