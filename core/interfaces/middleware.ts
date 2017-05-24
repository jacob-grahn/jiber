import { Action } from './action'

export interface Middleware {
  (action: Action): Action
}
