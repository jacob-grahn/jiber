import * as WS from 'ws'
import { default as EventEmitter } from 'events'
import { logger } from './utils/logger'
import { verifyClient as defaultVerifyClient } from './verify-client'
import { ConnectionToClient } from './connection-to-client'
import { PACKET_FROM_CLIENT } from './constants'

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
  private connectionMap: { [connectionId: string]: ConnectionToClient } = {}
  private wss: WS.Server

  constructor (inputOptions: SocketServerOptions) {
    super()
    const options = { ...defaultOptions, ...inputOptions }

    // if port is defined, ws creates and uses an internal server
    // this is not good if we want to pass in a custom server
    if (options.server) {
      delete options.port
    }

    this.wss = new WS.Server(options)
    this.wss.on('error', logger.error)
    this.wss.on('connection', this.onConnection)
  }

  public send = (connectionId: string, message: string) => {
    const connection = this.connectionMap[connectionId]
    if (connection) {
      connection.send(message)
    }
  }

  public close = () => {
    this.wss.close()
  }

  private onConnection = (ws: WS, request: any) => {
    const user = request.verified
    const connectionId = user.userId
    const connection = new ConnectionToClient(ws, user)
    this.connectionMap[connectionId] = connection

    // event handlers
    connection.on('close', () => delete this.connectionMap[connectionId])
    connection.on(PACKET_FROM_CLIENT, (event) => {
      this.emit(PACKET_FROM_CLIENT, event)
    })
  }
}
