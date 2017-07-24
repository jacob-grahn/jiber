import { Reducer, combineReducers } from '../../../core/index'
import connection from './connection'
import connectedAt from './connected-at'
import userId from './user-id'

// Reducer
const socket: Reducer = combineReducers({connection, connectedAt, userId})
export default socket
