import { Action, OPEN, CLOSE } from 'jiber-core'

export const watchers = (state = {}, action: Action) => {
  if (!action.$user) return

  switch (action.type) {
    case OPEN:
      return { ...state, [action.$uid]: action.$user }
    case CLOSE:
      const copy: any = { ...state }
      delete copy[action.$uid]
      return copy
    default:
      return state
  }
}
