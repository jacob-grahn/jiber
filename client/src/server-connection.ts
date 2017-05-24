import { Action } from '../../core/index'
import { login } from './reducers/hope-actions'
import Options from './interfaces/options'

export interface ServerConnection {
  send: (action: Action) => void,
  close: () => void
}

// Attepts to keep an open connection with the specified server
// Messages are held in a queue until the server sends back a confirmation
export default function createServerConnection (
  {serverUrl, socketPort, credential}: Options
): ServerConnection {
  const retryBackoffMs = 5000                                                   // wait 5 seconds before trying to reconnect, then 10 seconds, then 15, etc
  const OPEN = 1
  let socket: WebSocket
  let retryCount = 0
  let resendThreshold = 10000                                                   // re-send messages if they have not been confirmed within ten seconds
  let open = true

  connect()

  // Event handlers
  function onMessage (event: MessageEvent): void {
    const action = JSON.parse(event.data)
    console.log('received action', action)
  }
  function onClose (): void {
    reconnect()
  }
  function onOpen (): void {
    retryCount = 0
    send(login(credential))
  }

  // Open a socket connection
  function connect () {
    socket = new WebSocket(`ws://${serverUrl}`)
    socket.addEventListener('close', onClose)
    socket.addEventListener('open', onOpen)
    socket.addEventListener('message', onMessage)
  }

  // Wait a bit, and then call connect()
  function reconnect () {
    if (!open) return
    retryCount++
    const delay = retryCount * retryBackoffMs
    setTimeout(connect, delay)
  }

  // Add a message to be sent
  function send (action: Action): void {
    if (!open) return
    if (socket.readyState !== OPEN) return
    const strAction = JSON.stringify(action)
    socket.send(strAction)
  }

  // Close this connection
  function close () {
    open = false
    if (socket.readyState === OPEN) socket.close()
  }

  // public methods
  return {
    send,
    close
  }
}
