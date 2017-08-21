import { Action } from '../../core/index'

export type CreateOnAction = (
  pushAction: (roomId: string, action: Action) => Promise<void>,
  onRoomChange: (roomId: string) => any
) => OnAction
export type OnAction = (userId: string, action: Action) => void

/**
 * handles incoming actions
 * saves action to the db
 * then triggers a room update by calling onRoomChange()
 */
export const createOnAction: CreateOnAction = (pushAction, onRoomChange) => {
  return (userId, action) => {
    if (!action.$roomId) return
    const roomId = action.$roomId
    const userAction = {...action, $userId: userId}
    pushAction(roomId, userAction)
      .then(() => onRoomChange(roomId))
      .catch(_e => { /* do nothing */ })
  }
}
