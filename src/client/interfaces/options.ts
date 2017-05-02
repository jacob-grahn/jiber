import { Reducer, Middleware } from '../../core/index'

interface Options {
  reducer: Reducer,
  middleware: Array<Middleware>,
  roomId: string,
  serverUrl: string,
  stunPort: number,
  socketPort: number
}

export { Options as default }
