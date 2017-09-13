import { Reducer, combineReducers } from 'jiber-core'
import { connection } from './connection'
import { connectedAt } from './connected-at'
import { userId } from './user-id'

/**
 * Holds useful info for managing our socket connections
 */
export const socket: Reducer = combineReducers({
  connection,
  connectedAt,
  userId
})
