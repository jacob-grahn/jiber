import { Action } from '../../core/index'
import store from '../store'
import updateRoom from './update-room'

export default async function onAction (
  userId: string,
  action: Action
): Promise<void> {
  const roomId = action.room
  const state = store.getState()
  const room = state.rooms[roomId]
  const storage = state.options.storage
  if (!room) {                                                                  // make sure the room exists
    throw new Error('ROOM_NOT_FOUND')
  }
  await storage.addAction({...action, userId})                                  // add the action to the global action queue
  await updateRoom(roomId)                                                      // trigger a room update
}
