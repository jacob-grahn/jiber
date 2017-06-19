import { Action } from '../../core/index'
import Storage from '../interfaces/storage'

export default function createOnAction (
  updateRoom: Function,
  storage: Storage
) {
  return async function onAction (
    userId: string,
    action: Action
  ): Promise<void> {
    const roomId = action.$hope
    const userAction = {...action, userId}
    await storage.addActions(roomId, [userAction])                              // add the action to the global action queue
    await updateRoom(roomId)                                                    // trigger a room update
  }
}
