import { Action } from '../../core/index'

export const createHopeSocket = (
  tryToConnect: () => Promise<WebSocket>,
  onMessage: (event: MessageEvent) => void,
  sendAction: (socket: WebSocket, action: Action) => void
) => {
  let socket: WebSocket

  const connect = async () => {
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
