import { Action } from './action'
import { Store } from './store'

export interface Middleware {
  (store: Store): (next: (action: Action) => void) => (action: Action) => void
}
