import { Reducer, Middleware } from '../../core/index'

interface OptionsInput {
  credential?: string
  middleware?: Array<Middleware>,
  reducer?: Reducer,
  url?: string,
  socketPort?: number,
  stunPort?: number
}

export { OptionsInput as default }
