import { Action } from './interfaces/action'
import { Reducer } from './interfaces/reducer'
import { Middleware } from './interfaces/middleware'

export interface Store {
  getState: () => {rooms: any, [other: string]: any},
  getRoom: (roomType: string, roomId?: any) => {
    confirmedState: any,
    optimisticState: any
  },
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

  function getRoom (roomType: string, roomId: string): any {
    if (!roomId) return state.rooms[roomType]                                   // if there is no roomId, use roomType as the roomId
    return state.rooms[roomType][roomId]                                        // or use roomType and roomId
  }

  return {
    dispatch,
    getState,
    getRoom
  }
}
