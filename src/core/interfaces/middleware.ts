import { Action } from './action'
import { Store } from '../store'

export interface Middleware {
  (store: Store): (next: Function) => (action: Action) => void
}
