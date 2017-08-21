import { Reducer, Middleware } from '../../core/index'

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
