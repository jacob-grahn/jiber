import { createRoom, dictionary, combineReducers, Reducer } from 'jiber-core'
import { sockets } from './socket/sockets'
import { users } from './users'

/**
 * Top level reducer for the server
 */
export const createServerReducer = (subReducer: Reducer): Reducer => {
  const room = createRoom(subReducer)
  const rooms = dictionary(room, '$roomId')
  return combineReducers({ sockets, users, rooms })
}
