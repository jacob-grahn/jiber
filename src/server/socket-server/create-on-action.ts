import { Action, Store } from '../../core/index'

export default function createOnAction (store: Store, updateRoom: Function) {
  return async function onAction (
    userId: string,
    action: Action
  ): Promise<void> {
    const roomId = action.$hope
    const state = store.getState()
    const room = state.rooms[roomId]
    const storage = state.options.storage
    if (!room) {                                                                // make sure the room exists
      throw new Error('ROOM_NOT_FOUND')
    }
    await storage.addAction({...action, userId})                                // add the action to the global action queue
    await updateRoom(roomId)                                                    // trigger a room update
  }
}
