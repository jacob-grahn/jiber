import * as WebSocket from 'ws'
import { Store } from '../../core/index'
import { ServerSettings } from '../interfaces/server-settings'
import createOnConnect from './create-on-connect'
import createOnMessage from './create-on-message'
import createOnClose from './create-on-close'
import createOnLogIn from './create-on-log-in'
import createOnAction from './create-on-action'
import createUpdateRoom from './create-update-room'
import createSendToRoom from './create-send-to-room'

export interface SocketServer {
  start: () => void
}

export default function createSocketServer (
  store: Store, settings: ServerSettings
): SocketServer {
  const sendToRoom = createSendToRoom(store)
  const updateRoom = createUpdateRoom(store, sendToRoom)
  const onClose = createOnClose(store)
  const onAction = createOnAction(store, updateRoom)
  const onLogIn = createOnLogIn(store)
  const onMessage = createOnMessage(store, onLogIn, onAction)
  const onConnect = createOnConnect(store, onMessage, onClose)

  function start () {
    const wss = new WebSocket.Server({port: settings.socketPort})
    wss.on('connection', onConnect)
  }

  return {start}
}
