import { Action, SERVER, joinRoom, JOIN_ROOM, get } from '../core/index'
import ClientStore from './interfaces/client-store'

export interface ServerConnection {
  send: (action: Action) => void,
  close: () => void
}

export interface ServerConnectionOptions {
  url: string,
  socketPort: number,
  credential?: string,
  store: ClientStore
}

// Attepts to keep an open connection with the specified server
// Messages are held in a queue until the server sends back a confirmation
export default function createServerConnection (
  {url, socketPort, credential, store}: ServerConnectionOptions
): ServerConnection {
  const retryBackoffMs = 5000                                                   // wait 5 seconds before trying to reconnect, then 10 seconds, then 15, etc
  const OPEN = 1
  const queue: Action[] = []
  let socket: WebSocket
  let retryCount = 0
  let connectionIsWanted = true

  if (url) {
    connect()
  }

  // Event handlers
  function onMessage (event: MessageEvent): void {
    const action = JSON.parse(event.data)
    const meta = action.$hope || {}
    meta.source = SERVER
    store.dispatch(action)
  }
  function onClose (): void {
    reconnect()
  }
  function onOpen (): void {
    retryCount = 0
    rejoinRooms()
    sendQueue()
  }

  // Open a socket connection
  function connect () {
    if (!connectionIsWanted) return
    socket = new WebSocket(`ws://${url}:${socketPort}`, credential || undefined)
    socket.addEventListener('close', onClose)
    socket.addEventListener('open', onOpen)
    socket.addEventListener('message', onMessage)
  }

  // Wait a bit, and then call connect()
  function reconnect () {
    if (!connectionIsWanted) return
    retryCount++
    const delay = retryCount * retryBackoffMs
    setTimeout(connect, delay)
  }

  // Add a message to be sent
  function send (action: Action): void {
    if (canSend()) {
      const roomId = get(action, '$hope.roomId') || action.$hope
      const smallerAction = {...action, $hope: roomId}
      const strAction = JSON.stringify(smallerAction)
      socket.send(strAction)
    } else if (action.type !== JOIN_ROOM) {
      queue.push(action)
    }
  }

  function rejoinRooms () {
    const state = store.getState()
    Object.keys(state.rooms).forEach(roomId => {
      const action = joinRoom(roomId)
      send(action)
    })
  }

  function sendQueue (): void {
    const toSend = [...queue]
    queue.splice(0, queue.length)
    toSend.forEach(send)
  }

  function canSend (): boolean {
    if (!connectionIsWanted) return false
    if (!socket) return false
    if (socket.readyState !== OPEN) return false
    return true
  }

  // Close this connection
  function close () {
    connectionIsWanted = false
    if (socket.readyState === OPEN) socket.close()
  }

  // public methods
  return {
    send,
    close
  }
}
