import ServerSettingsInput from './interfaces/server-settings-input'
import ServerStore from './interfaces/server-store'
import { createStore } from '../core/index'
import createSocketServer from './socket-server/socket-server'
import createServerReducer from './reducers/server-reducer'
import createUpdateRoom from './update-room/index'
import createWelcomeNewMembers from './middleware/welcome-new-members'
import defaultSettings from './default-settings'

export default function createServerStore (
  inputSettings: ServerSettingsInput = {}
): ServerStore {
  const settings = {...defaultSettings, ...inputSettings}
  const serverReducer = createServerReducer(settings.reducer)
  const store = createStore(serverReducer, inputSettings.initialState)
  const socketServer = createSocketServer(store, settings)
  const updateRoom = createUpdateRoom(store, settings, socketServer)
  const welcomeNewMembers = createWelcomeNewMembers(socketServer.sendToUser)
  const middleware = [welcomeNewMembers]

  store.setMiddleware(middleware)
  socketServer.onRoomChange = updateRoom
  socketServer.start()                                                          // TODO: start should be called by the user
  return store
}
