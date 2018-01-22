import { Action, OPEN, CLOSE } from 'jiber-core'

export const members = (state = {}, action: Action) => {
  if (!action.$user) return

  switch (action.type) {
    case OPEN:
      return {...state, [action.$user.uid]: action.$user}
    case CLOSE:
      const copy: any = {...state}
      delete copy[action.$user.uid]
      return copy
    default:
      return state
  }
}
