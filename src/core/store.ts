import { Action } from './interfaces/action'
import { Reducer } from './interfaces/reducer'
import { Middleware } from './interfaces/middleware'
import { initMiddleware } from './init-middleware'

export interface Store {
  getState: () => any,
  dispatch: {(action: Action): any},
}

export const createStore = (
  reducer: Reducer,
  initialState: any = undefined,
  middlewares: Middleware[] = []
): Store => {
  let state: any = initialState
  let applyMiddleware: (action: Action) => void

  const dispatch = (action: Action): void => {                                  // run an action through middleware and the reducer
    applyMiddleware(action)                                                     // applyMiddleware will evantually call applyAction
  }

  const applyAction = (action: Action): void => {                               // replace the state with a new one created by the reducer
    state = reducer(state, action)
  }

  const getState = (): any => {
    return state
  }

  const setMiddleware = (middlewares: Middleware[]): void => {
    applyMiddleware = initMiddleware(
      middlewares,
      {dispatch, getState},
      applyAction
    )
  }

  setMiddleware(middlewares)
  dispatch({type: 'hope/INIT_SOCKET'})                                          // initialize reducer with it's default state

  return {dispatch, getState}
}
