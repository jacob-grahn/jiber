import { Reducer, Action, isFunction } from '../../core/index'

export interface ReducerObj {
  [key: string]: Reducer
}

export interface RoomsState {
  [key: string]: any
}

export default function rooms (input: Reducer|ReducerObj): Reducer {
  let reducer: Reducer
  let reducerObj: ReducerObj

  if (isFunction(input)) {
    reducer = input as Reducer
  } else {
    reducerObj = input as ReducerObj
  }

  return (state: any = {}, action: Action): RoomsState => {
    if (!action.type) {
      return {}
    }
    if (!action.$hope) {
      return state
    }
    const roomId = action.$hope.roomId || action.$hope
    const hasDot = roomId.indexOf('.') !== -1

    if (reducer && !hasDot) {
      const roomState = state[roomId]
      return {
        ...state,
        [roomId]: reducer(roomState, action)
      }
    }
    if (reducerObj && hasDot) {
      const [roomType, subRoomId] = roomId.split('.')
      const roomTypeDict = state[roomType] || {}
      const roomState = roomTypeDict[subRoomId]
      const reducer = reducerObj[roomType]
      return {
        ...state,
        [roomType]: {
          ...state[roomType],
          [subRoomId]: reducer(roomState, action)
        }
      }
    }
    return state
  }
}
