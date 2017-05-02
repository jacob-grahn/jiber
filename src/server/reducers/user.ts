import * as ws from 'ws'
import { Action } from '../../core/index'
import LogInResult from '../interfaces/log-in-result'

// actions
const INC_ACTION_COUNT = 'hope/user/INC_ACTION_COUNT'
const LOG_IN = 'hope/user/LOG_IN'
const UPDATE_ACCOUNT = 'hope/user/UPDATE_ACCOUNT'
const REMOVE = 'hope/user/REMOVE'

// Reducer
interface IUserState {
  actionCount: number,                                                          // This starts at 0 and increments with every action sent
  loggedInAt: number,                                                           // I guess this might be useful at some point
  id: string,                                                                   // User id
  account: {[key: string]: any}                                                 // A place to store misc account data
}

/**
 * This state is created When a socket is successfully logged in
 * It is possible for multiple sockets to point to the same account
 */
export default function reducer (
  state: IUserState,
  action: any = {}
): IUserState {
  switch (action.type) {
    case undefined:
      return {
        loggedInAt: 0,
        actionCount: 0,
        id: undefined,
        account: {}
      }

    case LOG_IN:
      if (state.id) return state                                                // prevent multiple logins
      return {
        ...state,
        loggedInAt: action.loggedInAt,
        id: action.id,
        account: action.account
      }

    case UPDATE_ACCOUNT:                                                        // if the account needs to be updated after logging in
      return {
        ...state,
        account: action.account
      }

    case INC_ACTION_COUNT:                                                      // should increment actionCount every time the user sends an action
      return {                                                                  // actionCount is used to prevent duplicating peer to peer actions
        ...state,
        actionCount: state.actionCount + 1
      }
  }
}

// Action Creators
export function incActionCount (userId: string): Action {
  return {type: INC_ACTION_COUNT, id: userId}
}

export function logIn (logInResult: LogInResult): Action {
  return {type: LOG_IN, id: logInResult.id, account: logInResult.data}
}

export function updateAccount (logInResult: LogInResult): Action {
  return {type: UPDATE_ACCOUNT, id: logInResult.id, account: logInResult.data}
}

export function userRemove (userId: String): Action {
  return { type: REMOVE, id: userId }
}
