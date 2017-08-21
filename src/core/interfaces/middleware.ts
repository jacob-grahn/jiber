import Action from './action'
import Store from './store'
import { Next } from './next'

interface Middleware {
  (store: Store): (next: Next) => (action: Action) => void
}

export default Middleware
