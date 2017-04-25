import socketReducer from './socket'
import * as socketActionTypes from './socket-action-types'
import { SOCKET_REMOVE } from './socket-dict-action-types'
import dict from '../helpers/dict'

const actionList = Object.values(socketActionTypes)

export default dict(socketReducer, actionList, SOCKET_REMOVE)
