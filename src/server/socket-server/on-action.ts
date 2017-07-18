import { Action } from '../../core/index'

export interface RoomActionDict {
  [key: string]: Action[]
}

export default function createOnAction (
  pushAction: (roomId: string, action: Action) => Promise<void>,
  onRoomChange: (roomId: string) => any
) {
  return async function onAction (
    userId: string,
    action: Action
  ): Promise<void> {
    const roomId = action.$hope
    const userAction = {...action, $hope: {userId, roomId}}
    await pushAction(roomId, userAction)
    onRoomChange(roomId)                                                        // trigger a room update
  }
}
