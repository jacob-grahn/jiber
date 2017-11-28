import { Action } from 'jiber-core'
import * as WebSocket from 'ws'
import { onAuthorize } from './on-authorize'
import { onConnect } from './on-connect'
import { ServerStore } from '../server-store'
import { sendToRoom } from './send-to-room'
import { sendToSocket } from './send-to-socket'
import { sendToUser } from './send-to-user'

export interface SocketServer {
  start: () => void,
  stop: () => void,
  sendToUser: (userId: string, action: Action) => void,
  sendToRoom: (roomId: string, action: Action) => void,
  sendToSocket: (socketId: string, action: Action) => void
}

/**
 * Listen for incoming user actions
 */
export const createSocketServer = (store: ServerStore) => {
  let wss: WebSocket.Server | undefined

  const stop = () => {
    if (!wss) return
    wss.close()
    wss = undefined
  }

  const start = () => {
    stop()
    wss = new WebSocket.Server({
      server: store.settings.server,
      port: store.settings.port,
      verifyClient: (info, cb) => onAuthorize(store, info, cb)
    })
    wss.on('error', (err) => console.log('wss error', err.message))
    wss.on('connection', (ws, request) => onConnect(store, ws, request))
  }

  // some currying here sure would be nice
  return {
    start,
    stop,
    sendToRoom: (roomId: string, action: Action) => {
      return sendToRoom(store.getState, roomId, action)
    },
    sendToSocket: (socketId: string, action: Action) => {
      return sendToSocket(store.getState, socketId, action)
    },
    sendToUser: (userId: string, action: Action) => {
      return sendToUser(store.getState, userId, action)
    }
  }
}
