import { Action, Reducer, Middleware, Store } from '../interfaces'
import { runMiddleware } from '../utils/run-middleware'
import { createSubscription } from '../utils/subscription'

/**
 * A store holds sate, and provides an interface to dispatch actions that
 * act on that state
 */
export const createStore = (
  reducer: Reducer,
  initialState: any = undefined,
  middlewares: Middleware[] = []
): Store => {
  let state: any = reducer(initialState, {} as Action)
  const subscription = createSubscription()

  const store = {
    dispatch: (action: Action): void => {
      runMiddleware(store, action, middlewares, (finalAction: Action) => {
        state = reducer(state, finalAction)
        subscription.publish(state, finalAction)
      })
    },
    getState: () => state,
    subscribe: subscription.subscribe
  }

  return store
}
