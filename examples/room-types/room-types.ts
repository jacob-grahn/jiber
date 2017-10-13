import { Reducer } from '../interfaces/reducer'
import { Action } from '../interfaces/action'
import { Dictionary } from './dictionary'
import { ReducerDict } from './combine-reducers'

/**
 * split roomId into [roomType, roomId]
 */
export const roomTypes = (reducerObj: ReducerDict): Reducer => {
  return (state: any = undefined, action: Action): Dictionary => {
    if (!action.$r) return state
    const [roomType] = action.$r.split('.')
    const reducer = reducerObj[roomType]
    return reducer(state, action)
  }
}
