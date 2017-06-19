import { Store } from '../../core/index'
import Storage from '../interfaces/storage'
import { beginUpdate, finishUpdate } from '../reducers/server-room/is-updating'

export default function createUpdateRoom (
  store: Store,
  sendToRoom: (roomId: string, data: any) => void,
  storage: Storage
) {
  return async function updateRoom (roomId: string): Promise<void> {
    const state = store.getState()
    const room = state.rooms[roomId]

    if (room.isUpdating) return

    store.dispatch(beginUpdate(roomId))                                         // start

    const actions = await storage.getActions(roomId, room.stateTimeMs)          // get the queued actions
    if (actions.length === 0) return
    const stateTimeMs = actions[actions.length - 1].time

    actions.forEach(action => store.dispatch(action))                           // process the actions

    actions.forEach(action => sendToRoom(roomId, action))                       // send the actions to members of the room
    await storage.setState(roomId, room.confirmedState)                         // store the new state
    await storage.removeActions(roomId, stateTimeMs)                            // remove the actions

    store.dispatch(finishUpdate(roomId))                                        // done
  }
}
