import { Action } from '../../core/index'

export type CreateOnAction = (
  pushAction: (roomId: string, action: Action) => Promise<void>,
  emitter: {emit: (eventType: string, roomId: string) => any}
) => OnAction
export type OnAction = (userId: string, action: Action) => void

/**
 * handles incoming actions
 * saves action to the db
 * then emits an event when it is done
 */
export const createOnAction: CreateOnAction = (pushAction, emitter) => {
  return (userId, action) => {
    if (!action.$roomId) return
    const roomId = action.$roomId
    const userAction = {...action, $userId: userId}
    pushAction(roomId, userAction)
      .then(() => emitter.emit('ACTION_ADDED', roomId))
      .catch(_e => { /* do nothing */ })
  }
}
