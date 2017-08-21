import { Action } from './action'
import { Store } from './store'
import { Next } from './next'

export interface Middleware {
  (store: Store): (next: Next) => (action: Action) => void
}
