import Action from './interfaces/action'
import Reducer from './interfaces/reducer'
import Middleware from './interfaces/middleware'
import Store from './interfaces/store'
import chainPromises from './utils/chain-promises'

/**
 * Run async middleware before commiting actions to a reducer
 */
export default function Store (
  reducer: Reducer,
  middleware: Array<Middleware> = []
): Store {
  let state: any

  function dispatch (action: Action): Promise<any> {
    return chainPromises(middleware, action).then(commit)
  }

  function commit (action: Action): any {
    state = reducer(state, action)
    return state
  }

  return {
    commit,
    dispatch,
    state
  }
}
