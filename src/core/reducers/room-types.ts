import Reducer from '../interfaces/reducer'
import Action from '../interfaces/action'
import Dictionary from '../interfaces/dictionary'

export interface ReducerObj {
  [key: string]: Reducer
}

export default function roomTypes (reducerObj: ReducerObj): Reducer {
  return (state: any = undefined, action: Action): Dictionary => {
    if (!action.$hope || !action.$hope.roomId) return state
    const roomId = action.$hope.roomId
    const [roomType] = roomId.split('.')
    const reducer = reducerObj[roomType]
    return reducer(state, action)
  }
}
