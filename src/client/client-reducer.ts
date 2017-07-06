import { dictionary, combineReducers, users, Reducer } from '../core/index'
import clientRoom from './reducers/client-room/client-room'
import me from './reducers/me'

export default function createClientReducer (subReducer: Reducer): Reducer {
  const room = clientRoom(subReducer)
  const rooms = dictionary(room, '$hope.roomId')
  const clientReducer = combineReducers({rooms, users, me})
  return clientReducer
}
