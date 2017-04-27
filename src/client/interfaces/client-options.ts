import { Reducer, Middleware } from '../../core'
import ServerOptions from './server-options'

interface ClientOptions {
  reducer?: Reducer,
  middleware?: Array<Middleware>,
  server?: ServerOptions
}

export { ClientOptions as default }
