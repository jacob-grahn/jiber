import store from '../store'
import Storage from '../interfaces/storage'
import { beginUpdate, finishUpdate } from '../reducers/room/room'
import sendToRoom from './send-to-room'
import { isFunction, Reducer } from '../../core/index'

export default async function updateRoom (roomId: string): Promise<void> {
  const state = store.getState()
  const room = state.rooms[roomId]
  const storage: Storage = state.options.storage

  if (room.isUpdating) return

  store.dispatch(beginUpdate(roomId))                                           // start

  const actions = await storage.getActions(roomId, room.stateTimeMs)            // get the queued actions
  if (actions.length === 0) return
  const stateTimeMs = actions[actions.length - 1].time

  const roomState = actions.reduce((roomState, action) => {                     // process the actions
    store.dispatch(action)
  }, room.confirmedState)

  actions.forEach(action => sendToRoom(roomId, action))                         // send the actions to members of the room
  await storage.setState(roomId, roomState)                                     // store the new state
  await storage.removeActions(roomId, stateTimeMs)                              // remove the actions
  store.dispatch(finishUpdate(roomId, roomState))                               // done
}
