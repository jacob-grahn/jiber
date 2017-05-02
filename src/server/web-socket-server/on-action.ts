import { Action } from '../../core/index'
import store from '../store'
import Storage from '../interfaces/storage'
import updateRoom from './update-room'

export default function onAction (
  userId: string,
  action: Action
): void {
  const roomId = action.room
  const room = store.state.rooms[roomId]
  const storage = store.state.options.storage
  if (!room) return
  storage.addAction({...action, userId})                                        // add the action to the global action queue
  .then(updateRoom(roomId))                                                     // trigger a room update
  return
}
