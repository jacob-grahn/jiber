import * as WS from 'ws'
import { default as EventEmitter } from 'events'
import { logger } from './utils/logger'
// import { LOGIN_RESULT } from './constants'
import { Packet } from './packet'
import { verifyClient as defaultVerifyClient } from './verify-client'

export interface SocketServerOptions {
  port?: number,
  verifyClient?: WS.VerifyClientCallbackAsync,
  server?: any
}

const defaultOptions: SocketServerOptions = {
  port: 80,
  verifyClient: defaultVerifyClient,
  server: undefined
}

export class SocketServer extends EventEmitter {
  private socketLookup: { [userId: string]: WS } = {}
  private wss: WS.Server

  constructor (inputOptions: SocketServerOptions) {
    super()
    const options = { ...defaultOptions, ...inputOptions }

    // if port is defined, it creates and uses an internal server
    // this is not good if we want to pass in a custom server
    if (options.server) {
      delete options.port
    }

    this.wss = new WS.Server(options)
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

  private onConnection = (ws: WS, request: any) => {
    const userId = request.verified.userId

    // close old socket if there is one
    if (this.socketLookup[userId]) {
      this.socketLookup[userId].close()
    }

    // store new socket
    this.socketLookup[userId] = ws

    // event handlers
    ws.on('close', () => delete this.socketLookup[userId])
    ws.on('error', logger.error)
    ws.on('message', (data: any) => {
      try {
        const packet = new Packet(JSON.parse(data.toString()))
        packet.user = userId
        this.emit('packetFromClient', packet)
      } catch (e) {
        logger.warning(e.message)
      }
    })

    // let the client know they logged in
    // this.send(userId, { type: LOGIN_RESULT, user: request.verified })
  }
}
