import { Action } from 'jiber-core'
import { ClientState } from '../interfaces/client-state'

/**
 * Send all optimistic actions that are owned by the currently logged in user
 */
export const createResendPending = (
  sendAction: (action: Action) => void,
  getState: () => ClientState
) => {
  return (roomId: string) => {
    const state = getState()
    const room = state.rooms[roomId]
    if (!room) return
    room.optimisticActions.forEach(action => sendAction(action))
  }
}
