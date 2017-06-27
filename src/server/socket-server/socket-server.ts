import * as WebSocket from 'ws'
import { Action, Store } from '../../core/index'
import ServerSettings from '../interfaces/server-settings'
import createOnConnect from './on-connect'
import createOnMessage from './on-message'
import createOnClose from './on-close'
import createOnAction from './on-action'
import createOnAuthorize from './on-authorize'
import createUpdateRoom from './update-room'
import createSendToRoom from './send-to-room'
import createSendToSocket from './send-to-socket'
import createSendToUser from './send-to-user'

export interface SocketServer {
  start: () => void,
  sendToUser: (userId: string, action: Action) => void
}

export default function createSocketServer (
  store: Store, settings: ServerSettings
): SocketServer {
  const sendToSocket = createSendToSocket(store)
  const sendToRoom = createSendToRoom(store, sendToSocket)
  const sendToUser = createSendToUser(store, sendToSocket)
  const updateRoom = createUpdateRoom(store, sendToRoom, settings.storage)
  const onClose = createOnClose(store, settings.storage.addAction)
  const onAction = createOnAction(settings.storage.addAction, updateRoom)
  const onAuthorize = createOnAuthorize(store, settings.onLogin)
  const onMessage = createOnMessage(store, onAction)
  const onConnect = createOnConnect(
    store,
    onMessage,
    onClose,
    sendToSocket
  )

  function start () {
    const wss = new WebSocket.Server({
      port: settings.socketPort,
      verifyClient: onAuthorize
    })
    wss.on('connection', onConnect as any)                                      // get around the imperfect typescript definitions for ws
    wss.on('error', (err) => console.log('wss error', err))
  }

  return {start, sendToUser}
}
