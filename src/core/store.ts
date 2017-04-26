import { IAction } from './i-action'
import { IReducer } from './i-reducer'
import { IMiddleware } from './i-middleware'
import { IStore } from './i-store'
import chainPromises from './utils/chain-promises'

/**
 * Run async middleware before commiting actions to a reducer
 */
export default function Store (
  reducer: IReducer,
  middleware: Array<IMiddleware> = []
): IStore {
  let state: any

  function dispatch (action: IAction): Promise<any> {
    return chainPromises(middleware, action).then(commit)
  }

  function commit (action: IAction): any  {
    state = reducer(state, action)
    return state
  }

  return {
    commit,
    dispatch,
    state
  }
}
