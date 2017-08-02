import { Action } from '../../core/index'
import ServerSettings from '../interfaces/server-settings'
import ServerState from '../interfaces/server-state'
import scheduler from '../utils/scheduler'
import createSyncRoom from './sync-room'
import createSyncRooms from './sync-rooms'
import createCloseRoom from './close-room'

export default function createSyncScheduler (
  store: {
    dispatch: (action: Action) => void,
    getState: () => ServerState
  },
  updateRoom: (roomId: string) => void,
  settings: ServerSettings
) {
  const closeRoom = createCloseRoom(store.dispatch)
  const syncRoom = createSyncRoom(updateRoom, closeRoom, settings)
  const syncRooms = createSyncRooms(store.getState, syncRoom)
  const syncScheduler = scheduler(syncRooms, settings.syncInterval)
  return syncScheduler
}
