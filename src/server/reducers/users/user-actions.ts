import {
  USER_INC_ACTION_COUNT,
  USER_LOG_IN,
  USER_UPDATE_ACCOUNT
} from './user-action-types'
import { Action } from '../../../core/index'
import LogInResult from '../../interfaces/log-in-result'

export function userIncActionCount (userId: string): Action {
  return {type: USER_INC_ACTION_COUNT, id: userId}
}

export function userLogIn (logInResult: LogInResult): Action {
  return {type: USER_LOG_IN, id: logInResult.id, account: logInResult.data}
}

export function userUpdateAccount (logInResult: LogInResult): Action {
  return {type: USER_UPDATE_ACCOUNT, id: logInResult.id, account: logInResult.data}
}
