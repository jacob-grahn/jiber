import serverRoom from './reducers/server-room/server-room'
import sockets from './reducers/socket/sockets'
import { dictionary, combineReducers, users, Reducer } from '../core/index'

export default function makeServerReducer (subReducer: Reducer): Reducer {
  const room = serverRoom(subReducer)
  const rooms = dictionary(room, '$hope.roomId')
  return combineReducers({sockets, users, rooms})
}
