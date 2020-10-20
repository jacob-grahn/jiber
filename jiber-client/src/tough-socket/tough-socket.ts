import { tryToConnect } from './try-to-connect'
import { Settings } from '../settings'

/**
 * ToughSocket works much like a regular WebSocket, but it will always
 * try to reconnect if the connection fails
 */
export class ToughSocket {
  public onmessage?: (event: any) => void
  private socket: WebSocket | undefined
  private settings: Settings
  private queue: string[] = []

  constructor (settings: Settings) {
    this.settings = settings
    this.connect()
  }

  public send = (str: string) => {
    if (this.socket && this.socket.readyState === this.socket.OPEN) {
      this.socket.send(str)
    } else {
      this.queue.push(str)
    }
  }

  private sendQueue = () => {
    const queue = this.queue
    this.queue = []
    queue.forEach(this.send)
  }

  private connect = () => {
    if (!this.settings.url) return
    tryToConnect(this.settings)
      .then(socket => {
        this.socket = socket
        if (this.onmessage) {
          socket.onmessage = this.onmessage
        }
        socket.onclose = () => setTimeout(this.connect, 3000)
        this.sendQueue()
      })
      .catch(console.log)
  }

  public close = () => {
    const socket: any = this.socket
    if (socket) {
      delete socket.onclose
      socket.close()
      delete this.socket
    }
  }
}
