import { Action } from './interfaces/action'
import { Reducer } from './interfaces/reducer'
import { Middleware } from './interfaces/middleware'

export interface Store {
  getState: (roomType?: string, roomId?: any) => any,
  dispatch: {(action: Action): any}
}

export default function createStore (
  reducer: Reducer,
  initialState: any = undefined,
  middlewares: Middleware[] = []
): Store {
  let state: any = initialState
  const applyMiddleware = initMiddleware(middlewares)
  const store = {dispatch, getState}

  function dispatch (action: Action): void {
    applyMiddleware(action)                                                     // applyMiddleware will evantually call applyAction
  }

  function applyAction (action: Action): void {                                 // replace the state with a new one created by the reducer
    state = reducer(state, action)
  }

  function initMiddleware (
    middlewares: Middleware[]
  ): (action: Action) => void {
    const withStore = middlewares.map(mid => mid(store))                        // give each middleware the store
    const reversed = withStore.reverse()
    return reversed.reduce(                                                     // set up each middleware to call the next
      (next, mid) => mid(next),
      applyAction                                                               // the final middleware calls applyAction
    )
  }

  function getState (): any {
    return state
  }

  return store
}
