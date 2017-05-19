import * as ws from 'ws'
import { Action, stateDictionary } from '../../core/index'
import LogInResult from '../interfaces/log-in-result'

// Setup
const keyName = 'userId'
interface UserState {
  actionId: number,                                                          // Starts at 0 and increments with every action sent
  loggedInAt: number,                                                           // Might be useful at some point
  userId: string,                                                               // User id
  account: {[key: string]: any}                                                 // Place to store misc account data
}

const defaultUserState = {
  loggedInAt: 0,
  actionId: 0,
  userId: '',
  account: {}
}

// Actions
const INC_ACTION_COUNT = 'hope/user/INC_ACTION_COUNT'
const LOG_IN = 'hope/user/LOG_IN'
const UPDATE_ACCOUNT = 'hope/user/UPDATE_ACCOUNT'
const REMOVE = 'hope/user/REMOVE'

// Reducer
function reducer (
  state: UserState = defaultUserState,
  action: Action
): UserState {
  switch (action.type) {
    case LOG_IN:
      if (state.userId) return state                                            // prevent multiple logins
      return {
        ...state,
        loggedInAt: action.loggedInAt,
        userId: action.userId,
        account: action.account
      }

    case UPDATE_ACCOUNT:                                                        // if the account needs to be updated after logging in
      return {
        ...state,
        account: action.account
      }

    case INC_ACTION_COUNT:                                                      // should increment actionId every time the user sends an action
      return {                                                                  // actionId is used to prevent duplicating peer to peer actions
        ...state,
        actionId: state.actionId + 1
      }

    default:
      return state
  }
}

export default stateDictionary(reducer, {keyName})

// Action Creators
export function incActionCount (userId: string): Action {
  return {type: INC_ACTION_COUNT, userId}
}

export function logIn (result: LogInResult): Action {
  return {type: LOG_IN, userId: result.id, account: result.data}
}

export function updateAccount (result: LogInResult): Action {
  return {type: UPDATE_ACCOUNT, userId: result.id, account: result.data}
}

export function userRemove (userId: String): Action {
  return { type: REMOVE, userId }
}
