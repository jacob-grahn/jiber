import { Action } from '../../core'
import store from '../store'
import Storage from '../interfaces/storage'
import updateRoom from './update-room'

export default async function onAction (
  userId: string,
  action: Action
): Promise<void> {
  const roomId = action.room
  const room = store.state.rooms[roomId]
  const storage = store.state.options.storage
  if (!room) return
  await storage.addAction({...action, userId})                                  // add the action to the global action queue
  await updateRoom(roomId)                                                      // trigger a room update
}
