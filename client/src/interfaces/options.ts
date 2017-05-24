import { Reducer, Middleware } from '../../../core/index'

interface Options {
  credential: string
  middleware: Array<Middleware>,
  reducer: Reducer,
  roomId: string,
  serverUrl: string,
  socketPort: number,
  stunPort: number
}

export { Options as default }
