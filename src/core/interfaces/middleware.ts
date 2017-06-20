import Action from './action'
import Store from './store'

interface Middleware {
  (store: Store): (next: Function) => (action: Action) => void
}

export default Middleware
