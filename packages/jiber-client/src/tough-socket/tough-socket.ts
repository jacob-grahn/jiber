import { tryToConnect } from './try-to-connect'
import { ClientSettings } from '../interfaces/client-settings'
import { errorHandler } from '../utils/error-handler'

/**
 * ToughSocket works much like a regular WebSocket, but it will always
 * try to reconnect if the connection fails
 * @hidden
 */
export class ToughSocket {
  public onmessage?: (event: any) => void
  private socket: WebSocket
  private settings: ClientSettings

  constructor (settings: ClientSettings) {
    this.settings = settings
    this.connect()
  }

  public send = (str: string) => {
    if (!this.socket || this.socket.readyState !== this.socket.OPEN) return
    this.socket.send(str)
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
      })
      .catch(errorHandler)
  }
}
