import { Action, INIT_SOCKET } from '../../../core/index'

export const connectedAt = (state: number = 0, action: Action): number => {
  switch (action.type) {
    case INIT_SOCKET:
      return action.timeMs
    default:
      return state
  }
}
