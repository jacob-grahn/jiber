import { Action, User } from '../interfaces'
import { CLOSE } from '../constants/action-types'
import { dictionary } from './dictionary'

const watcher = (state: User | undefined, action: Action): User | undefined => {
  if (!action.$user) return state

  switch (action.type) {
    case CLOSE:
      return undefined
    default:
      return action.$user
  }
}

export const watchers = dictionary(dictionary(watcher, '$uid'), '$docId')
