import Action from './interfaces/action'
import Reducer from './interfaces/reducer'
import Middleware from './interfaces/middleware'

export interface Store {
  getState: () => any,
  dispatch: {(action: Action): any}
}

export default function createStore (
  reducer: Reducer,
  initialState: any = undefined,
  middleware: Middleware[] = []
): Store {
  let state: any = initialState

  function dispatch (action: Action): any {
    const finalAction = applyMiddleware(action)
    state = reducer(state, finalAction)
    return state
  }

  function applyMiddleware (action: Action): Action {
    return middleware.reduce((action, middleware) => {
      return middleware(action)
    }, action)
  }

  function getState (): any {
    return state
  }

  return {
    dispatch,
    getState
  }
}
