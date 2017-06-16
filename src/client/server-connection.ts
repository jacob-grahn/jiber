import { Action, Store, SERVER, loginRequest, joinRoom } from '../core/index'

export interface ServerConnection {
  send: (action: Action) => void,
  sendQueue: () => void,
  close: () => void
}

export interface ServerConnectionOptions {
  url: string,
  socketPort: number,
  credential?: string,
  store: Store
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

  setInterval(sendQueue, 1000)                                                  // todo: fix this hack

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
    if (retryCount === 0) rejoinRooms()
    reconnect()
  }
  function onOpen (): void {
    retryCount = 0
    send(loginRequest(credential))
  }

  // Open a socket connection
  function connect () {
    if (!connectionIsWanted) return
    socket = new WebSocket(`ws://${url}:${socketPort}`)
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
      const strAction = JSON.stringify(action)
      socket.send(strAction)
    } else {
      queue.push(action)
    }
  }

  /* function isMember (roomId: string): boolean {
    if (!roomId) return true
    const state = store.getState()
    const rooms = state.rooms
    const myUserId = state.me.userId
    return !!(myUserId && rooms[roomId] && rooms[roomId].actionIds[myUserId])
  } */

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
    sendQueue,
    close
  }
}
