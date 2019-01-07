import * as WS from 'ws'
import { logger } from './utils/logger'
import { LOGIN_RESULT } from './constants'
import { Packet } from './packet'
import { verifyClient as defaultVerifyClient } from './verify-client'

export class SocketServer {
  private socketLookup: {[userId: string]: WS} = {}
  private wss: WS.Server

  constructor (
    port: number = 80,
    verifyClient?: WS.VerifyClientCallbackAsync,
    customServer?: any
  ) {
    this.wss = new WS.Server({
      server: customServer,
      verifyClient: verifyClient || defaultVerifyClient,
      port: customServer ? undefined : port
    })
    this.wss.on('error', logger.error)
    this.wss.on('connection', this.onConnection)
  }

  public send = (userId: string, action: any) => {
    const ws = this.socketLookup[userId]
    if (ws && ws.readyState === WS.OPEN) {
      ws.send(JSON.stringify(action))
    }
  }

  public close = () => {
    this.wss.close()
  }

  public on = (name: string, func: (...args: any[]) => void) => {
    this.wss.on(name, func)
  }

  private onConnection = (ws: WS, request: any) => {
    const userId = request.verified.userId

    // close old socket if there is one
    if (this.socketLookup[userId]) {
      this.socketLookup[userId].close()
    }

    // store new socket
    this.socketLookup[userId] = ws

    // event handlers
    ws.on('close', () => {
      delete this.socketLookup[userId]
    })
    ws.on('error', logger.error)
    ws.on('message', (data: any) => {
      try {
        const packet = new Packet(JSON.parse(data.toString()))
        packet.user = userId
        this.wss.emit('packet', packet)
      } catch (e) {
        logger.warning(e.message)
      }
    })

    // let the client know they logged in
    this.send(userId, { type: LOGIN_RESULT, user: request.verified })
  }
}
