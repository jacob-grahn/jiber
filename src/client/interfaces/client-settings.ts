import { Reducer, Middleware } from '../../core/index'

export interface ClientSettings {
  credential: string
  middleware: Array<Middleware>,
  reducer: Reducer,
  url: string,
  socketPort: number,
  stunPort: number,
  initialState: any,
  backoffMs: number
}
