import { Action } from '../../core/index'
import ServerSettings from '../interfaces/server-settings'
import ServerState from '../interfaces/server-state'
import { createScheduler } from '../utils/scheduler'
import { createSyncRoom } from './sync-room'
import { createSyncRooms } from './sync-rooms'
import { createCloseRoom } from './close-room'

export const createSyncScheduler = (
  store: {
    dispatch: (action: Action) => void,
    getState: () => ServerState
  },
  updateRoom: (roomId: string) => void,
  settings: ServerSettings
) => {
  const closeRoom = createCloseRoom(store.dispatch)
  const syncRoom = createSyncRoom(updateRoom, closeRoom, settings)
  const syncRooms = createSyncRooms(store.getState, syncRoom)
  const scheduler = createScheduler(syncRooms, settings.syncInterval)
  return scheduler
}
