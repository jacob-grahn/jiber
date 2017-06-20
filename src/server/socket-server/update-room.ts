import { Action, confirmedState } from '../../core/index'
import Storage from '../interfaces/storage'
import ServerStore from '../interfaces/server-store'
import { beginUpdate, finishUpdate } from '../reducers/server-room/is-updating'
import { needsUpdate } from '../reducers/server-room/needs-update'

export default function createUpdateRoom (
  store: ServerStore,
  sendToRoom: (roomId: string, data: any) => void,
  storage: Storage
) {
  async function updateRoom (roomId: string): Promise<void> {
    await initializeIfNeeded(roomId)
    const actions = await processNewActions(roomId)
    actions.forEach(action => sendToRoom(roomId, action))                       // send the actions to members of the room
    startUpdateIfNeeded(roomId)                                                 // if more actions came in during the update, then start another update
  }

  async function initializeIfNeeded (roomId: string): Promise<void> {           // if the room does not exist, create a new room using a snapshot from storage
    const state = store.getState()
    const room = state.rooms[roomId]
    if (!room) {
      store.dispatch(beginUpdate(roomId))
      const roomState = await storage.getState(roomId)
      store.dispatch(confirmedState(roomId, roomState))
      store.dispatch(finishUpdate(roomId))
    }
  }

  async function processNewActions (roomId: string): Promise<Action[]> {
    const state = store.getState()
    const room = state.rooms[roomId]
    if (!room) return []
    if (room.isUpdating) return store.dispatch(needsUpdate(roomId))             // if the room is already updating, mark it for another update later

    store.dispatch(beginUpdate(roomId))                                         // start
    const actions = await storage.getActions(roomId, room.lastUpdatedAt)        // get the queued actions
    actions.forEach(action => store.dispatch(action))                           // process the actions
    store.dispatch(finishUpdate(roomId))                                        // done
    return actions
  }

  function startUpdateIfNeeded (roomId: string): any {                          // start another update if room.needsUpdate is true
    const state = store.getState()
    const room = state.rooms[roomId]
    if (room && !room.isUpdating && room.needsUpdate) {
      return updateRoom(roomId)
    }
  }

  return updateRoom
}
