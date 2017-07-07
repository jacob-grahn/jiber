import ServerSettingsInput from './interfaces/server-settings-input'
import { ServerStore } from './interfaces/server-store'
import { createStore } from '../core/index'
import createSocketServer from './socket-server/socket-server'
import createServerReducer from './server-reducer'
import createSaveRoom from './update-room/save-room'
import createUpdateRoom from './update-room/update-room'
import createWelcomeNewMembers from './middleware/welcome-new-members'
import defaultSettings from './default-settings'

export default function createServerStore (
  inputSettings: ServerSettingsInput = {}
): ServerStore {
  const settings = {...defaultSettings, ...inputSettings}
  const serverReducer = createServerReducer(settings.reducer)
  const store = createStore(serverReducer, inputSettings.initialState)
  const saveRoom = createSaveRoom(store.getState, settings)
  const updateRoom = createUpdateRoom(store, settings.storage, saveRoom)
  const socketServer = createSocketServer(store, settings, updateRoom)

  const welcomeNewMembers = createWelcomeNewMembers(socketServer.sendToUser)
  const middleware = [welcomeNewMembers]

  store.setMiddleware(middleware)
  socketServer.start()
  return store
}
