import { tryToConnect } from './try-to-connect'
import { ClientSettings } from '../interfaces/client-settings'

type ToughSocket = {
  send: (str: string) => void,
  onmessage?: (event: any) => void
}

/**
 * Create an always retrying socket connection
 * Handle incoming messages with onMessage
 */
export const createToughSocket = (settings: ClientSettings): ToughSocket => {
  let socket: WebSocket

  const self: ToughSocket = {
    send: (str: string) => {
      if (!socket || socket.readyState !== socket.OPEN) return
      socket.send(str)
    }
  }

  const connect = async () => {
    socket = await tryToConnect(settings)
    if (self.onmessage) socket.onmessage = self.onmessage
    socket.onclose = () => setTimeout(connect, 3000)
  }
  connect() // tslint:disable-line

  return self
}
