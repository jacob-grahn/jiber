import Action from './action'

interface Middleware {
  (action: Action): Action
}

export { Middleware as default }
