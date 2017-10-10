import { createStore, ACTION_PUSHED } from 'jiber-core'
import * as EventEmitter from 'events'
import { ServerSettingsInput } from './interfaces/server-settings-input'
import { ServerStore } from './interfaces/server-store'
import { createSocketServer } from './socket-server/index'
import { createServerReducer } from './reducers/server-reducer'
import { createUpdateRoom } from './update-room/index'
import { createWelcomeNewMembers } from './middleware/welcome-new-members'
import { defaultServerSettings } from './default-server-settings'
import { createOnAction } from './on-action'

export const createServerStore = (
  inputSettings: ServerSettingsInput = {}
): ServerStore => {
  const emitter = new EventEmitter()
  const initialState = inputSettings.initialState
  const settings = {...defaultServerSettings, ...inputSettings}
  const serverReducer = createServerReducer(settings.reducer)
  const welcomeNewMembers = createWelcomeNewMembers(emitter)
  const middleware = [welcomeNewMembers]
  const store = createStore(serverReducer, initialState, middleware)
  const socketServer = createSocketServer(store, settings, emitter)
  const updateRoom = createUpdateRoom(store, settings, socketServer)
  const onAction = createOnAction(updateRoom, socketServer.sendToUser)

  settings.db.emitter.on(ACTION_PUSHED, onAction)

  return {
    ...store,
    start: socketServer.start,
    stop: socketServer.stop
  }
}
