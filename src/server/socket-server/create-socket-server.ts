import * as WebSocket from 'ws'
import { Store } from '../../core/index'
import { ServerSettings } from '../interfaces/server-settings'
import createOnConnect from './create-on-connect'
import createOnMessage from './create-on-message'
import createOnClose from './create-on-close'
import createOnLogin from './create-on-login'
import createOnAction from './create-on-action'
import createUpdateRoom from './create-update-room'
import createSendToRoom from './create-send-to-room'
import createSendToSocket from './create-send-to-socket'

export interface SocketServer {
  start: () => void
}

export default function createSocketServer (
  store: Store, settings: ServerSettings
): SocketServer {
  const sendToSocket = createSendToSocket(store)
  const sendToRoom = createSendToRoom(store, sendToSocket)
  const updateRoom = createUpdateRoom(store, sendToRoom)
  const onClose = createOnClose(store)
  const onAction = createOnAction(store, updateRoom)
  const onLogin = createOnLogin(store, settings.onLogin, sendToSocket)
  const onMessage = createOnMessage(store, settings, onLogin, onAction)
  const onConnect = createOnConnect(store, onMessage, onClose)

  function start () {
    const wss = new WebSocket.Server({port: settings.socketPort})
    wss.on('connection', onConnect)
  }

  return {start}
}
