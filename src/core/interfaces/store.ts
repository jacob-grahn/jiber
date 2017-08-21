import { Action } from './action'
import { Middleware } from './middleware'

export interface Store {
  getState: () => any,
  dispatch: {(action: Action): any},
  setMiddleware: (middleware: Middleware[]) => void
}
