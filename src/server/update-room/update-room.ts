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
  saveRoom: (roomId: string) => void
) {

  return function (sendToRoom: (roomId: string, data: any) => void) {
    return noConcurrent(async function (roomId: string) {
      if (!roomId) return undefined
      try {
        const room = await getRoom (roomId)
        const actions = await storage.fetchActions(roomId, room.lastUpdatedAt)  // get the queued actions

        actions.forEach(action => {
          const actionWithMeta = addMetadata(room, action)
          store.dispatch(actionWithMeta)
          delete actionWithMeta.$hope.source
          sendToRoom(roomId, actionWithMeta)
        })

        process.nextTick(() => saveRoom(roomId))
      } catch (e) {
        console.log('updateRoom error', e.message)
      }
    })
  }

  async function getRoom (roomId: string): Promise<RoomState> {                 // if the room does not exist, create a new room using a snapshot from storage
    const state = store.getState()
    const room = state.rooms[roomId]
    if (room) return room

    const roomState = await storage.fetchState(roomId)
    store.dispatch(confirmedState(roomId, roomState))
    return store.getState().rooms[roomId]
  }

  function addMetadata (room: RoomState, action: Action): Action {              // process the actions
    const userId = action.$hope.userId
    const member = room.members[userId] || {}
    const lastActionId = member.actionId || 0
    action.$hope.source = SERVER
    action.$hope.actionId = lastActionId + 1
    return action
  }
}
