import ServerSettingsInput from './interfaces/server-settings-input'
import ServerStore from './interfaces/server-store'
import { createStore } from '../core/index'
import createSocketServer from './socket-server/socket-server'
import createServerReducer from './reducers/server-reducer'
import createUpdateRoom from './update-room/index'
import createCloseRoom from './close-room'
import createWelcomeNewMembers from './middleware/welcome-new-members'
import createSync from './sync'
import defaultSettings from './default-settings'

export default function createServerStore (
  inputSettings: ServerSettingsInput = {}
): ServerStore {
  const settings = {...defaultSettings, ...inputSettings}
  const serverReducer = createServerReducer(settings.reducer)
  const store = createStore(serverReducer, inputSettings.initialState)
  const socketServer = createSocketServer(store, settings)
  const updateRoom = createUpdateRoom(store, settings, socketServer)
  const closeRoom = createCloseRoom(store.dispatch)
  const welcomeNewMembers = createWelcomeNewMembers(socketServer.sendToUser)
  const middleware = [welcomeNewMembers]
  const sync = createSync(store.getState, updateRoom, closeRoom, settings)

  store.setMiddleware(middleware)
  socketServer.onRoomChange = updateRoom

  socketServer.start()                                                          // TODO: start should be called by the user
  sync.start()

  return store
}
