import { Reducer, Middleware } from '../../core/index'

interface Options {
  credential: string
  middleware: Array<Middleware>,
  reducer: Reducer,
  url: string,
  socketPort: number,
  stunPort: number
}

export { Options as default }
