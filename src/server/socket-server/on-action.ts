import { Action } from '../../core/index'

export interface RoomActionDict {
  [key: string]: Action[]
}

export default function createOnAction (
  pushAction: (roomId: string, action: Action) => Promise<void>,
  onRoomChange: (roomId: string) => any
) {
  return function onAction (
    userId: string,
    action: Action
  ): void {
    if (!action.$hope || !action.$hope.roomId) return
    const roomId = action.$hope.roomId
    const userAction = {...action, $hope: {userId, roomId}}
    pushAction(roomId, userAction)
      .then(() => onRoomChange(roomId))                                         // trigger a room update
      .catch(_e => { /* do nothing */ })
  }
}
