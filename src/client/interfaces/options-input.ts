import { Reducer, Middleware } from '../../core'

interface OptionsInput {
  reducer?: Reducer,
  middleware?: Array<Middleware>,
  roomId?: string,
  serverUrl?: string,
  stunPort?: number,
  socketPort?: number
}

export { OptionsInput as default }
