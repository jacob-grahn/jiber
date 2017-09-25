// todo: users should maybe be a server only reducer
import { createRoom, createDictionary, combineReducers, users, Reducer } from 'jiber-core'
import { sockets } from './socket/sockets'

/**
 * Top level reducer for the server
 */
export const createServerReducer = (subReducer: Reducer): Reducer => {
  const room = createRoom(subReducer)
  const rooms = createDictionary(room, '$roomId')
  return combineReducers({sockets, users, rooms})
}
