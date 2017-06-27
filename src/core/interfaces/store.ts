import Action from './action'
import Middleware from './middleware'

interface Store {
  getState: () => any,
  dispatch: {(action: Action): any},
  setMiddleware: (middleware: Middleware[]) => void
}

export default Store
