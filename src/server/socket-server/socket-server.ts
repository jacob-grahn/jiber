import { Action } from '../../core/index'
import * as WebSocket from 'ws'
import SocketServer from '../interfaces/socket-server'
import { SendToUser } from './send-to-user'

export default function createSocketServer (
  sendToUser: SendToUser,
  sendToRoom: (roomId: string, action: Action) => void,
  onConnect: (webSocket: WebSocket, request: any) => void,
  onAuthorize: (
    info: {origin: string, req: any, secure: boolean},
    cb: (result: boolean, code?: number, name?: string) => void
  ) => void,
  socketPort: number
) {
  let wss: WebSocket.Server|undefined
  const socketServer: SocketServer = {start, stop, sendToUser, sendToRoom}

  function start () {
    stop()
    wss = new WebSocket.Server({
      port: socketPort,
      verifyClient: onAuthorize
    })
    wss.on('connection', onConnect as any)
  }

  function stop () {
    if (!wss) return
    wss.close()
    wss = undefined
  }

  return socketServer
}
