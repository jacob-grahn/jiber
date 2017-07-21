import { Reducer, Middleware } from '../../core/index'

interface ClientSettingsInput {
  credential?: string
  middleware?: Array<Middleware>,
  reducer?: Reducer,
  url?: string,
  socketPort?: number,
  stunPort?: number,
  initialState?: any
}

export default ClientSettingsInput
