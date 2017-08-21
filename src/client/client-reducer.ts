import { createDictionary, combineReducers, users, Reducer } from '../core/index'
import { createClientRoom } from './reducers/client-room/client-room'
import { me } from './reducers/me'

export const createClientReducer = (subReducer: Reducer) => {
  const room = createClientRoom(subReducer)
  const rooms = createDictionary(room, '$roomId')
  const clientReducer = combineReducers({rooms, users, me})
  return clientReducer
}
