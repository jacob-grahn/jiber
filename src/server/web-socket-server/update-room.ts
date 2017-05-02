import store from '../store'
import Storage from '../interfaces/storage'
import {
  beginUpdate,
  finishUpdate
} from '../reducers/room'
import sendToRoom from './send-to-room'

export default async function updateRoom (roomId: string): Promise<void> {
  const room = store.state.rooms[roomId]
  const storage: Storage = store.state.options.storage
  const reducer = store.state.options.reducer

  if (room.isUpdating) return Promise.resolve()

  store.commit(beginUpdate(roomId))                                             // start

  const actions = await storage.getNewActions(roomId, room.stateTimeMs)         // get the queued actions
  const stateTimeMs = actions[actions.length - 1].time
  if (actions.length === 0) return Promise.resolve()

  const roomState = actions.reduce((roomState, action) => {                     // process the actions
    return reducer(roomState, action)
  }, room.roomState)

  actions.forEach(action => sendToRoom(roomId, action))                         // send the actions to members of the room
  await storage.setState(roomId, roomState)                                     // store the new state
  await storage.removeOldActions(roomId, stateTimeMs)                           // remove the actions
  store.commit(finishUpdate(roomId, roomState, stateTimeMs))                    // done
}
