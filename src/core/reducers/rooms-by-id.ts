import { Reducer, Action, Dictionary, isFunction } from '../../core/index'

export interface ReducerObj {
  [key: string]: Reducer
}

export default function rooms (input: Reducer|ReducerObj): Reducer {
  let reducer: Reducer
  let reducerObj: ReducerObj

  if (isFunction(input)) {
    reducer = input as Reducer
  } else {
    reducerObj = input as ReducerObj
  }

  return (state: any = {}, action: Action): Dictionary => {
    if (!action.type || !action.$hope) {
      return state
    }

    const roomId = action.$hope.roomId || action.$hope

    if (reducer) {
      const roomState = state[roomId]
      return {
        ...state,
        [roomId]: reducer(roomState, action)
      }
    }

    if (reducerObj) {
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
