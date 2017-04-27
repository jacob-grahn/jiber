import Action from './action'

interface Middleware {
  (action: Action, state: any): Promise<Action>|Action
}

export { Middleware as default }
