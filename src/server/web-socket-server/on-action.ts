import { Action } from '../../core/index'
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
  if (!room) {                                                                  // make sure the room exists
    throw new Error('ROOM_NOT_FOUND')
  }
  if (room.memberIds.indexOf(userId) === -1) {                                  // make sure user is a member of the room
    throw new Error('NOT_ROOM_MEMBER')
  }
  await storage.addAction({...action, userId})                                  // add the action to the global action queue
  await updateRoom(roomId)                                                      // trigger a room update
}
