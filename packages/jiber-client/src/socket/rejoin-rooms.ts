import { JOIN_ROOM, Action } from 'jiber-core'
import { ClientState } from '../interfaces/client-state'

/**
 * Send a JOIN_ROOM action for every room in the store
 */
export const createRejoinRooms = (
  sendAction: (action: Action) => void,
  getState: () => ClientState
) => {
  return () => {
    const state = getState()
    Object.keys(state.rooms).forEach($r => {
      sendAction({type: JOIN_ROOM, $r})
    })
  }
}
