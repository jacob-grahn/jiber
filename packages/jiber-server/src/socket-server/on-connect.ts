import { Action, LOGIN_RESULT, INIT_SOCKET, get } from 'jiber-core'
import * as ws from 'ws'
import { ServerState } from '../interfaces/server-state'
import { OnClose } from './on-close'
import { OnMessage } from './on-message'
import { SendToSocket } from './send-to-socket'

export type CreateOnConnect = (
  store: {
    dispatch: (action: Action) => void,
    getState: () => ServerState
  },
  onMessage: OnMessage,
  onClose: OnClose,
  sendToSocket: SendToSocket
) => OnConnect
export type OnConnect = (webSocket: ws, request: any) => void

/**
 * handles 'connect' socket event
 * adds some event listeners to the newly created socket
 * dispatches an event to add the socket to the store
 */
export const createOnConnect: CreateOnConnect = (
  store,
  onMessage,
  onClose,
  sendToSocket
) => {
  const addListeners = (socketId: string, webSocket: ws) => {
    webSocket.on('message', (data) => onMessage(socketId, data.toString()))
    webSocket.on('close', () => onClose(socketId))
  }

  const initSocket = (socketId: string, ws: ws) => {
    const socketAction = {type: INIT_SOCKET, socketId, ws}
    store.dispatch(socketAction)
  }

  const sendLoginResult = (socketId: string, user: any) => {
    const action = {type: LOGIN_RESULT, user}
    sendToSocket(socketId, action)
  }

  return (webSocket, request) => {
    const state = store.getState()

    const socketId = get(request, 'headers.sec-websocket-key')
    if (!socketId) return

    const userId = get(state, `sockets.${socketId}.userId`)
    if (!userId) return

    const user = state.users[userId]

    addListeners(socketId, webSocket)
    initSocket(socketId, webSocket)
    sendLoginResult(socketId, user)
  }
}
