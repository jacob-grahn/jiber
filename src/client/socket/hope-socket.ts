import { Action } from '../../core/index'

export default function createHopeSocket (
  tryToConnect: () => Promise<WebSocket>,
  onMessage: (event: MessageEvent) => void,
  sendAction: (socket: WebSocket, action: Action) => void
) {
  let socket: WebSocket

  async function connect () {
    socket = await tryToConnect()
    socket.onmessage = onMessage
    socket.onclose = connect                                                    // try to reconnect if the connection is lost
  }

  connect()
    .catch(() => { /* do nothing */ })

  return {
    send: (action: Action) => sendAction(socket, action)
  }
}
