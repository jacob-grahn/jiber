import * as WebSocket from 'ws'
import { Store } from '../../core/index'
import { ServerSettings } from '../interfaces/server-settings'
import createOnConnect from './on-connect'
import createOnMessage from './on-message'
import createOnClose from './on-close'
import createOnLogin from './on-login'
import createOnAction from './on-action'
import createUpdateRoom from './update-room'
import createSendToRoom from './send-to-room'
import createSendToSocket from './send-to-socket'

export interface SocketServer {
  start: () => void
}

export default function createSocketServer (
  store: Store, settings: ServerSettings
): SocketServer {
  const sendToSocket = createSendToSocket(store)
  const sendToRoom = createSendToRoom(store, sendToSocket)
  const updateRoom = createUpdateRoom(store, sendToRoom, settings.storage)
  const onClose = createOnClose(store)
  const onAction = createOnAction(updateRoom, settings.storage)
  const onLogin = createOnLogin(store, settings.onLogin, sendToSocket)
  const onMessage = createOnMessage(
    store,
    settings,
    onLogin,
    onAction,
    sendToSocket
  )
  const onConnect = createOnConnect(
    store,
    settings,
    onMessage,
    onClose,
    sendToSocket
  )

  function start () {
    const wss = new WebSocket.Server({port: settings.socketPort})
    wss.on('connection', onConnect)
  }

  return {start}
}
