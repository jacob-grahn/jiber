import * as EventEmitter from 'events'
import { Store, SEND_TO_USER } from 'jiber-core'
import { ServerSettings } from '../interfaces/server-settings'
import { createOnConnect } from './on-connect'
import { createOnMessage } from './on-message'
import { createOnClose } from './on-close'
import { createOnAuthorize } from './on-authorize'
import { createSendToRoom, SendToRoom } from './send-to-room'
import { createSendToSocket } from './send-to-socket'
import { createSendToUser, SendToUser } from './send-to-user'
import { createSocketServer as _createSocketServer } from './socket-server'

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
  const db = settings.db
  const sendToSocket = createSendToSocket(store.getState)
  const sendToRoom = createSendToRoom(store.getState, sendToSocket)
  const sendToUser = createSendToUser(store.getState, sendToSocket)
  const onClose = createOnClose(store, db.pushAction)
  const onAuthorize = createOnAuthorize(store.dispatch, settings.login)
  const onMessage = createOnMessage(store.getState, db.pushAction, sendToSocket)
  const onConnect = createOnConnect(store, onMessage, onClose, sendToSocket)

  emitter.on(SEND_TO_USER, sendToUser)

  const socketServer = _createSocketServer(
    onAuthorize,
    onConnect,
    settings.socketPort
  )

  return {...socketServer, sendToUser, sendToRoom}
}
