import { Reducer, Middleware } from '../../core/index'

interface OptionsInput {
  credential?: string
  middleware?: Array<Middleware>,
  reducer?: Reducer,
  roomId?: string,
  serverUrl?: string,
  socketPort?: number,
  stunPort?: number
}

export { OptionsInput as default }
