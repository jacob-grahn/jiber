import * as WS from 'ws'
import { Packet } from './packet'
import { v4 as uuidv4 } from 'uuid'
import { logger } from './utils/logger'
import { default as EventEmitter } from 'events'
import { WELCOME, SERVER, PACKET_FROM_CLIENT } from './constants'

export class ConnectionToClient extends EventEmitter {

  private id: string
  private user: any
  private socket: WS

  constructor (socket: WS, user: any) {
    super()
    this.id = uuidv4()
    this.user = user
    this.socket = socket
    socket.on('message', this.onMessage)
    this.sendWelcomePacket()
  }

  private onMessage = (data: any) => {
    try {
      const packet = new Packet(JSON.parse(data.toString()))
      packet.user = this.user
      packet.conn = this.id
      this.emit(PACKET_FROM_CLIENT, packet)
    } catch (e) {
      logger.warning(e.message)
    }
  }

  private sendWelcomePacket = () => {
    const welcomePacket = new Packet({
      type: WELCOME,
      user: this.user,
      time: Date.now(),
      trust: SERVER,
      conn: this.id
    })
    this.send(JSON.stringify(welcomePacket))
  }

  public send = (message: string) => {
    if (this.socket.readyState === WS.OPEN) {
      this.socket.send(message)
    }
  }

  public getId = () => {
    return this.id
  }
}
