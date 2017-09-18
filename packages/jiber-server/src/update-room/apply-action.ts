import { Action } from 'jiber-core'
import { addMetadata } from './add-metadata'
import { ServerState } from '../interfaces/server-state'

export const createApplyAction = (
  dispatch: (action: Action) => void,
  getState: () => ServerState,
  sendToRoom: (roomId: string, action: Action) => void
) => {
  return (action: Action): void => {
    if (!action.$roomId) return
    const state = getState()
    action = addMetadata(state, action)

    if (!action.$roomId) return
    dispatch(action)
    sendToRoom(action.$roomId, action)
  }
}
