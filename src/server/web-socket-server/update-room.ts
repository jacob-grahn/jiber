import store from '../store'
import Storage from '../interfaces/storage'
import {
  beginUpdate,
  finishUpdate
} from '../reducers/room'
import sendToRoom from './send-to-room'

export default async function updateRoom (roomId: string): Promise<void> {
  const state = store.getState()
  const room = state.rooms[roomId]
  const storage: Storage = state.options.storage
  const reducer = state.options.reducer

  if (room.isUpdating) return Promise.resolve()

  store.dispatch(beginUpdate(roomId))                                           // start

  const actions = await storage.getActions(roomId, room.stateTimeMs)            // get the queued actions
  const stateTimeMs = actions[actions.length - 1].time
  if (actions.length === 0) return Promise.resolve()

  const roomState = actions.reduce((roomState, action) => {                     // process the actions
    return reducer(roomState, action)
  }, room.roomState)

  actions.forEach(action => sendToRoom(roomId, action))                         // send the actions to members of the room
  await storage.setState(roomId, roomState)                                     // store the new state
  await storage.removeActions(roomId, stateTimeMs)                              // remove the actions
  store.dispatch(finishUpdate(roomId, roomState, stateTimeMs))                  // done
}
