import * as WS from 'ws'
import { Action } from './action'
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
    this.sendWelcomeAction()
  }

  private onMessage = (data: any) => {
    try {
      const action = new Action(JSON.parse(data.toString()))
      action.user = this.user
      action.conn = this.id
      this.emit(PACKET_FROM_CLIENT, action)
    } catch (e) {
      logger.warning(e.message)
    }
  }

  private sendWelcomeAction = () => {
    const welcomeAction = new Action({
      type: WELCOME,
      user: this.user,
      time: Date.now(),
      trust: SERVER,
      conn: this.id
    })
    this.send(JSON.stringify(welcomeAction))
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
