import { Action } from './action'
import { Store } from '../create-store'

export interface Middleware {
  (store: Store): (next: Function) => (action: Action) => void
}
