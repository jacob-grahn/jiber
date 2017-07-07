import * as WebSocket from 'ws'
import { Action, Store } from '../../core/index'
import ServerSettings from '../interfaces/server-settings'
import createOnConnect from './on-connect'
import createOnMessage from './on-message'
import createOnClose from './on-close'
import createOnAction from './on-action'
import createOnAuthorize from './on-authorize'
import createSendToRoom from './send-to-room'
import createSendToSocket from './send-to-socket'
import createSendToUser from './send-to-user'

export interface SocketServer {
  start: () => void,
  sendToUser: (userId: string, action: Action) => void
}

export default function createSocketServer (
  store: Store, settings: ServerSettings, updateRoom: Function
): SocketServer {
  const storage = settings.storage
  const sendToSocket = createSendToSocket(store)
  const sendToRoom = createSendToRoom(store, sendToSocket)
  const sendToUser = createSendToUser(store, sendToSocket)
  const onClose = createOnClose(store, storage.pushAction)
  const onAction = createOnAction(storage.pushAction, updateRoom(sendToRoom))
  const onAuthorize = createOnAuthorize(store, settings.onLogin)
  const onMessage = createOnMessage(store, onAction)
  const onConnect = createOnConnect(store, onMessage, onClose, sendToSocket)

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
