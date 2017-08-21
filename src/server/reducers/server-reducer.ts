import { createDictionary, combineReducers, users, Reducer } from '../../core/index'
import { createServerRoom } from './server-room'
import { sockets } from './socket/sockets'

export const createServerReducer = (subReducer: Reducer): Reducer => {
  const room = createServerRoom(subReducer)
  const rooms = createDictionary(room, '$roomId')
  return combineReducers({sockets, users, rooms})
}
