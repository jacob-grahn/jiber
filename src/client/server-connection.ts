import { Action, SERVER, get } from '../core/index'
import { login } from './reducers/hope-client/hope-actions'

export interface ServerConnection {
  send: (action: Action) => void,
  close: () => void
}

export interface ServerConnectionOptions {
  url: string,
  socketPort: number,
  credential?: string,
  dispatch: Function
}

// Attepts to keep an open connection with the specified server
// Messages are held in a queue until the server sends back a confirmation
export default function createServerConnection (
  {url, socketPort, credential, dispatch}: ServerConnectionOptions
): ServerConnection {
  const retryBackoffMs = 5000                                                   // wait 5 seconds before trying to reconnect, then 10 seconds, then 15, etc
  const OPEN = 1
  let socket: WebSocket
  let retryCount = 0
  let open = false

  if (url) {
    connect()
  }

  // Event handlers
  function onMessage (event: MessageEvent): void {
    const action = JSON.parse(event.data)
    action.$hope.source = SERVER
    dispatch(action)
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
    open = true
    socket = new WebSocket(`ws://${url}:${socketPort}`)
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
    if (!socket) return
    if (socket.readyState !== OPEN) return
    const roomId = get(action, '$hope.roomId')
    const smallerAction = {...action, $hope: roomId}
    const strAction = JSON.stringify(smallerAction)
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
