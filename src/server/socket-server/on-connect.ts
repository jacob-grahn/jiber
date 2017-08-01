import { Action, LOGIN_RESULT, INIT_SOCKET, get } from '../../core/index'
import * as ws from 'ws'
import ServerStore from '../interfaces/server-store'

export default function createOnConnect (
  store: ServerStore,
  onMessage: (socketId: string, message: string) => void,
  onClose: (socketId: string) => void,
  sendToSocket: (socketId: string, action: Action) => void
) {
  return function onConnect (webSocket: ws, request: any): void {
    const state = store.getState()

    const socketId = get(request, 'headers.sec-websocket-key')
    if (!socketId) return

    const userId = get(state, `sockets.${socketId}.userId`)
    if (!userId) return

    const publicUserState = get(state, `users.${userId}.public`)
    if (!publicUserState) return

    addListeners(socketId, webSocket)
    initSocket(socketId, webSocket)
    sendLoginResult(socketId, publicUserState)
  }

  function addListeners (socketId: string, webSocket: ws) {
    webSocket.on('message', (message) => onMessage(socketId, message))
    webSocket.on('close', () => onClose(socketId))
  }

  function initSocket (socketId: string, connection: ws) {
    const timeMs = new Date().getTime()
    const socketAction = {type: INIT_SOCKET, socketId, connection, timeMs}
    store.dispatch(socketAction)
  }

  function sendLoginResult (socketId: string, user: any) {
    const action = {type: LOGIN_RESULT, user}
    sendToSocket(socketId, action)
  }
}
