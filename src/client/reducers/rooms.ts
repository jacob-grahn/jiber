import { Reducer, Action, isFunction } from '../../core/index'

interface ReducerObj {
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

  return (state: any = {}, action: Action = {}): any => {
    if (!action.type) {
      return {}
    }
    if (!action.hopeRoomId) {
      return state
    }
    if (reducer && action.hopeRoomId.indexOf('.') === -1) {
      const roomState = state[action.hopeRoomId]
      return {
        ...state,
        [action.hopeRoomId]: reducer(roomState, action)
      }
    }
    if (reducerObj && action.hopeRoomId.indexOf('.') !== -1) {
      const [roomType, roomId] = action.hopeRoomId.split('.')
      const roomTypeDict = state[roomType] || {}
      const roomState = roomTypeDict[roomId]
      const reducer = reducerObj[roomType]
      return {
        ...state,
        [roomType]: {
          ...state[roomType],
          [roomId]: reducer(roomState, action)
        }
      }
    }
    return state
  }
}
