import * as ws from 'ws'
import {
  USER_INC_ACTION_COUNT,
  USER_LOG_IN,
  USER_SET_ACCOUNT
} from './user-action-types'

interface IUserState {
  actionCount: number,                                                          // This starts at 0 and increments with every action sent
  loggedInAt: number,                                                           // I guess this might be useful at some point
  id: string,                                                                   // User id
  account: {[key: string]: string|number}                                       // A place to store misc account data
}

/**
 * This state is created When a socket is successfully logged in
 * It is possible for multiple sockets to point to the same account
 */
export default function (state: IUserState, action: any = {}): IUserState {
  switch (action.type) {
    case undefined:
      return {
        loggedInAt: 0,
        actionCount: 0,
        id: undefined,
        account: {}
      }

    case USER_LOG_IN:
      if (state.id) return state                                                // prevent multiple logins
      return {
        ...state,
        loggedInAt: action.loggedInAt,
        id: action.id,
        account: action.account
      }

    case USER_SET_ACCOUNT:                                                      // if the account needs to be updated after logging in
      return {
        ...state,
        account: action.account
      }

    case USER_INC_ACTION_COUNT:                                                 // should increment actionCount every time the user sends an action
      return {                                                                  // actionCount is used to prevent duplicating peer to peer actions
        ...state,
        actionCount: state.actionCount + 1
      }
  }
}
