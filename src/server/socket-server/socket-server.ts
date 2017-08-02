import * as WebSocket from 'ws'
import { Store } from '../../core/index'
import ServerSettings from '../interfaces/server-settings'
import SocketServer from '../interfaces/socket-server'
import createOnConnect from './on-connect'
import createOnMessage from './on-message'
import createOnClose from './on-close'
import createOnAction from './on-action'
import createOnAuthorize from './on-authorize'
import createSendToRoom from './send-to-room'
import createSendToSocket from './send-to-socket'
import createSendToUser from './send-to-user'

export default function createSocketServer (
  store: Store,
  settings: ServerSettings
): SocketServer {
  let wss: WebSocket.Server|undefined
  const storage = settings.storage
  const sendToSocket = createSendToSocket(store.getState)
  const sendToRoom = createSendToRoom(store.getState, sendToSocket)
  const sendToUser = createSendToUser(store.getState, sendToSocket)
  const onClose = createOnClose(store, storage.pushAction)
  const onAction = createOnAction(storage.pushAction, onRoomChange)
  const onAuthorize = createOnAuthorize(store.dispatch, settings.onLogin)
  const onMessage = createOnMessage(store.getState, onAction, sendToSocket)
  const onConnect = createOnConnect(store, onMessage, onClose, sendToSocket)

  const socketServer: SocketServer = {start, stop, sendToUser, sendToRoom}

  function start () {
    stop()
    wss = new WebSocket.Server({
      port: settings.socketPort,
      verifyClient: onAuthorize
    })
    wss.on('connection', onConnect as any)                                      // get around the imperfect typescript definitions for ws
  }

  function stop () {
    if (!wss) return
    wss.close()
    wss = undefined
  }

  function onRoomChange (roomId: string): void {
    if (socketServer.onRoomChange) socketServer.onRoomChange(roomId)
  }

  return socketServer
}
