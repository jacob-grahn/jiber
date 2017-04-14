import roomReducer from './room'
import * as roomActions from './room-actions'
import { REMOVE_ROOM } from './room-dict-actions'
import dict from './dict'

const actionList = Object.values(roomActions)

export default dict(roomReducer, actionList, REMOVE_ROOM)
