import * as EventEmitter from 'events'
import { Store } from '../../core/index'
import { ServerSettings } from '../interfaces/server-settings'
import { createOnConnect } from './on-connect'
import { createOnMessage } from './on-message'
import { createOnClose } from './on-close'
import { createOnAction } from './on-action'
import { createOnAuthorize } from './on-authorize'
import { createSendToRoom, SendToRoom } from './send-to-room'
import { createSendToSocket } from './send-to-socket'
import { createSendToUser, SendToUser } from './send-to-user'
import { createSocketServer as _createSocketServer } from './socket-server'
import { SEND_TO_USER } from '../../core/constants/event-types'

export interface SocketServer {
  start: () => void,
  stop: () => void,
  sendToUser: SendToUser,
  sendToRoom: SendToRoom
}

/**
 * Odd manual dependency injection
 */
export const createSocketServer = (
  store: Store,
  settings: ServerSettings,
  emitter: EventEmitter
): SocketServer => {
  const storage = settings.storage
  const sendToSocket = createSendToSocket(store.getState)
  const sendToRoom = createSendToRoom(store.getState, sendToSocket)
  const sendToUser = createSendToUser(store.getState, sendToSocket)
  const onClose = createOnClose(store, storage.pushAction)
  const onAction = createOnAction(storage.pushAction, emitter)
  const onAuthorize = createOnAuthorize(store.dispatch, settings.onLogin)
  const onMessage = createOnMessage(store.getState, onAction, sendToSocket)
  const onConnect = createOnConnect(store, onMessage, onClose, sendToSocket)

  emitter.on(SEND_TO_USER, sendToUser)

  const socketServer = _createSocketServer(
    onAuthorize,
    onConnect,
    settings.socketPort
  )

  return {...socketServer, sendToUser, sendToRoom}
}
