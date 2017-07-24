import Action from './interfaces/action'
import Reducer from './interfaces/reducer'
import Middleware from './interfaces/middleware'
import Store from './interfaces/store'
import initMiddleware from './init-middleware'

export default function createStore (
  reducer: Reducer,
  initialState: any = undefined,
  middlewares: Middleware[] = []
): Store {
  let state: any = initialState
  let applyMiddleware: Function
  const store = {dispatch, getState, setMiddleware}

  setMiddleware(middlewares)

  dispatch({type: 'hope/INIT_SOCKET'})                                                 // initialize reducer with it's default state

  function dispatch (action: Action): void {                                    // run an action through middleware and the reducer
    applyMiddleware(action)                                                     // applyMiddleware will evantually call applyAction
  }

  function applyAction (action: Action): void {                                 // replace the state with a new one created by the reducer
    state = reducer(state, action)
  }

  function getState (): any {
    return state
  }

  function setMiddleware (middlewares: Middleware[]): void {
    applyMiddleware = initMiddleware(middlewares, store, applyAction)
  }

  return store
}
