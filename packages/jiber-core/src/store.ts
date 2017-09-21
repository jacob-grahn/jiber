import { Action } from './interfaces/action'
import { Reducer } from './interfaces/reducer'
import { Middleware } from './interfaces/middleware'
import { initMiddleware } from './init-middleware'
import { createSubscription } from './utils/subscription'

export interface Store {
  getState: () => any,
  dispatch: (action: Action) => any,
  subscribe: (listener: Function) => Function
}

/**
 * A store holds sate, and provides an interface to dispatch actions that
 * act on that state
 */
export const createStore = (
  reducer: Reducer,
  initialState: any = undefined,
  middlewares: Middleware[] = []
): Store => {
  let state: any = initialState
  let applyMiddleware: (action: Action) => void

  const subscription = createSubscription()

  const dispatch = (action: Action): void => {                                  // run an action through middleware and the reducer
    applyMiddleware(action)                                                     // applyMiddleware will evantually call applyAction
  }

  const applyAction = (action: Action): void => {                               // replace the state with a new one created by the reducer
    state = reducer(state, action)
    subscription.publish(action)
  }

  const getState = (): any => {
    return state
  }

  const store = {dispatch, getState, subscribe: subscription.subscribe}

  const setMiddleware = (middlewares: Middleware[]): void => {
    applyMiddleware = initMiddleware(
      middlewares,
      store,
      applyAction
    )
  }

  setMiddleware(middlewares)

  return store
}
