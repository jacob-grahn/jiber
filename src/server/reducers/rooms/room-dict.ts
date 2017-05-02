import roomReducer from './room'
import * as roomActionTypes from './room-action-types'
import { ROOM_REMOVE } from './room-dict-action-types'
import dict from '../helpers/dict'
import { values } from '../../../core/index'

const actionList = values(roomActionTypes)

export default dict(roomReducer, actionList, ROOM_REMOVE)
