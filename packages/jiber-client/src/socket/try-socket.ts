/**
 * Create an always retrying socket connection
 * Handle incoming messages with onMessage
 */
export const createTrySocket = (
  tryToConnect: () => Promise<WebSocket>,
  onMessage: (event: MessageEvent) => void
) => {
  let socket: WebSocket

  const connect = () => {
    tryToConnect()
    .then(_socket => {
      socket = _socket
      socket.onmessage = onMessage
      socket.onclose = connect
    })
    .catch(tryToConnect)
  }

  connect()

  return {
    send: (str: string) => {
      if (!socket || socket.readyState !== socket.OPEN) return
      socket.send(str)
    }
  }
}
