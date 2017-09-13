import { Action } from 'jiber-core'

/**
 * Create an always retrying socket connection
 * Handle incoming messages with onMessage
 * todo: passing in sendAction is a little odd
 */
export const createTrySocket = (
  tryToConnect: () => Promise<WebSocket>,
  onMessage: (event: MessageEvent) => void,
  sendAction: (socket: WebSocket, action: Action) => void
) => {
  let socket: WebSocket

  const connect = () => {
    tryToConnect()
    .then(_socket => {
      socket = _socket
      socket.onmessage = onMessage
      socket.onclose = connect                                                  // try to reconnect if the connection is lost
    })
    .catch(_e => { /* do nothing */ })
  }

  connect()

  return {
    send: (action: Action) => sendAction(socket, action)
  }
}
