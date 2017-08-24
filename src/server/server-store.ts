import * as EventEmitter from 'events'
import { ServerSettingsInput } from './interfaces/server-settings-input'
import { ServerStore } from './interfaces/server-store'
import { createStore } from '../core/index'
import { createSocketServer } from './socket-server/index'
import { createServerReducer } from './reducers/server-reducer'
import { createUpdateRoom } from './update-room/index'
import { createWelcomeNewMembers } from './middleware/welcome-new-members'
import { createSyncScheduler } from './sync-scheduler/index'
import { defaultSettings } from './default-settings'

export const createServerStore = (
  inputSettings: ServerSettingsInput = {}
): ServerStore => {
  const emitter = new EventEmitter()
  const settings = {...defaultSettings, ...inputSettings}
  const serverReducer = createServerReducer(settings.reducer)
  const store = createStore(serverReducer, inputSettings.initialState)
  const socketServer = createSocketServer(store, settings, emitter)
  const updateRoom = createUpdateRoom(store, settings, socketServer)
  const welcomeNewMembers = createWelcomeNewMembers(socketServer.sendToUser)
  const syncScheduler = createSyncScheduler(store, updateRoom, settings)
  const middleware = [welcomeNewMembers]

  store.setMiddleware(middleware)
  emitter.on('ACTION_ADDED', updateRoom)

  return {
    ...store,
    start () {
      socketServer.start()
      syncScheduler.start()
    },
    stop () {
      socketServer.stop()
      syncScheduler.stop()
    }
  }
}
