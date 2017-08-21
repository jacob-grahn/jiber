import * as WebSocket from 'ws'
import { OnAuthorize } from './on-authorize'
import { OnConnect } from './on-connect'
import { SendToRoom } from './send-to-room'
import { SendToUser } from './send-to-user'

export type CreateSocketServer = (
  onAuthorize: OnAuthorize,
  onConnect: OnConnect,
  sendToRoom: SendToRoom,
  sendToUser: SendToUser,
  socketPort: number
) => SocketServer
export interface SocketServer {
  start: () => void,
  stop: () => void,
  sendToRoom: SendToRoom,
  sendToUser: SendToUser,
  onRoomChange?: (roomId: string) => void
}

export const createSocketServer: CreateSocketServer = (
  onAuthorize,
  onConnect,
  sendToRoom,
  sendToUser,
  socketPort
) => {
  let wss: WebSocket.Server|undefined

  const stop = () => {
    if (!wss) return
    wss.close()
    wss = undefined
  }

  const start = () => {
    stop()
    wss = new WebSocket.Server({
      port: socketPort,
      verifyClient: onAuthorize as any
    })
    wss.on('connection', onConnect as any)
  }

  return {start, stop, sendToUser, sendToRoom}
}
