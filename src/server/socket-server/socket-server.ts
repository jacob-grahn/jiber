import * as WebSocket from 'ws'
import { OnAuthorize } from './on-authorize'
import { OnConnect } from './on-connect'

export type CreateSocketServer = (
  onAuthorize: OnAuthorize,
  onConnect: OnConnect,
  socketPort: number
) => SocketServerToggle
export interface SocketServerToggle {
  start: () => void,
  stop: () => void
}

export const createSocketServer: CreateSocketServer = (
  onAuthorize,
  onConnect,
  socketPort
): SocketServerToggle => {
  let wss: WebSocket.Server | undefined

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

  return {start, stop}
}
