import { dictionary, combineReducers, users, Reducer } from '../../core/index'
import serverRoom from './server-room'
import sockets from './socket/sockets'

export default function makeServerReducer (subReducer: Reducer): Reducer {
  const room = serverRoom(subReducer)
  const rooms = dictionary(room, '$roomId')
  return combineReducers({sockets, users, rooms})
}
