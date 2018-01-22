/**
 * Keep track of the last $madeAt value from others users
 * This used used to make sure late optimistic updates are ignored
 */

import { Action, User, SERVER, CLOSE } from 'jiber-core'

export interface WatchersState {
  [uid: string]: {
    user: User,
    time: number
  }
}

export const watchers = (state: WatchersState = {}, action: Action): WatchersState => {
  if (action.$src !== SERVER || !action.$user) return state

  switch (action.type) {
    case CLOSE:
      const copy = { ...state }
      delete copy[action.$uid]
      return copy
    default:
      return {...state, [action.$uid]: {
        user: action.$user,
        time: action.$madeAt || 0
      }}
  }
}
