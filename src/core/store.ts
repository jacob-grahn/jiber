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
  middleware: Middleware[] = []
): Store {
  let state: any = initialState

  function dispatch (action: Action): any {
    const finalAction = applyMiddleware(action)
    state = reducer(state, finalAction)
    return state
  }

  function applyMiddleware (action: Action): Action {
    /* return middleware.reduce((action, middleware) => {
      return middleware(action)
    }, action) */
    return action
  }

  function getState (roomType: string, roomId: string): any {
    if (!roomId && !roomType) return state                                      // if there is no roomId or roomType
    if (!roomId) return state.rooms[roomType]                                   // if there is no roomId, use roomType as the roomId
    return state.rooms[roomType][roomId]                                        // or use roomType and roomId
  }

  return {
    dispatch,
    getState
  }
}
