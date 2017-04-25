import userReducer from './user'
import * as userActionTypes from './user-action-types'
import { USER_REMOVE } from './user-dict-action-types'
import dict from '../helpers/dict'

const actionList = Object.values(userActionTypes)

export default dict(userReducer, actionList, USER_REMOVE)
