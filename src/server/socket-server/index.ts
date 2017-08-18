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
import createSocketServer from './socket-server'

export default function (
  store: Store,
  settings: ServerSettings
): SocketServer {
  const storage = settings.storage
  const sendToSocket = createSendToSocket(store.getState)
  const sendToRoom = createSendToRoom(store.getState, sendToSocket)
  const sendToUser = createSendToUser(store.getState, sendToSocket)
  const onClose = createOnClose(store, storage.pushAction)
  const onAction = createOnAction(storage.pushAction, onRoomChange)
  const onAuthorize = createOnAuthorize(store.dispatch, settings.onLogin)
  const onMessage = createOnMessage(store.getState, onAction, sendToSocket)
  const onConnect = createOnConnect(store, onMessage, onClose, sendToSocket)
  const socketServer = createSocketServer(
    sendToUser,
    sendToRoom,
    onConnect,
    onAuthorize,
    settings.socketPort
  )

  function onRoomChange (roomId: string): void {
    if (socketServer.onRoomChange) socketServer.onRoomChange(roomId)
  }

  return socketServer
}
