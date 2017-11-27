import { createDictionary, combineReducers, Reducer } from 'jiber-core'
import { createClientRoom } from './reducers/client-room/client-room'
import { me } from './reducers/me'

/**
 * Top level reducer for the client
 */
export const createClientReducer = (subReducer: Reducer) => {
  const room = createClientRoom(subReducer)
  const rooms = createDictionary(room, '$roomId')
  const clientReducer = combineReducers({ rooms, me })
  return clientReducer
}
