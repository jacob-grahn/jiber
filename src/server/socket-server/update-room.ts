import {
  Action,
  RoomState,
  SERVER,
  confirmedState
} from '../../core/index'
import Storage from '../interfaces/storage'
import ServerStore from '../interfaces/server-store'
import noConcurrent from '../utils/no-concurrent'

export default function createUpdateRoom (
  store: ServerStore,
  storage: Storage,
  sendToRoom: (roomId: string, data: any) => void,
  saveRoom: (roomId: string) => void
) {
  const updateRoom: (roomId: string) => Promise<void> = noConcurrent(
    async function (roomId: string): Promise<void> {
      try {
        const room = await getRoom (roomId)
        const actions = await storage.getActions(roomId, room.lastUpdatedAt)    // get the queued actions

        actions.forEach(action => {
          const actionWithMeta = addMetadata(room, action)
          store.dispatch(actionWithMeta)
          sendToRoom(roomId, actionWithMeta)
        })

        process.nextTick(() => saveRoom(roomId))
      } catch (e) {
        console.log('updateRoom error', e.message)
      }
    }
  )

  async function getRoom (roomId: string): Promise<RoomState> {                 // if the room does not exist, create a new room using a snapshot from storage
    const state = store.getState()
    const room = state.rooms[roomId]
    if (room) return room

    const roomState = await storage.getState(roomId)
    store.dispatch(confirmedState(roomId, roomState))
    return store.getState().rooms[roomId]
  }

  function addMetadata (room: RoomState, action: Action): Action {              // process the actions
    const lastActionId = room.actionIds[action.$hope.userId] || 0
    action.$hope.source = SERVER
    action.$hope.actionId = lastActionId + 1
    return action
  }

  return updateRoom
}
