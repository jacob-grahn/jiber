import { Action } from '../core/index'

interface ServerConnection {
  send: (action: Action) => Promise<boolean>,
  close: () => void
}

/**
 * Attepts to keep an open connection with the specified server
 * Messages are held in a queue until the server sends back a confirmation
 */
export default function serverConnection (
  serverUrl: string,
  socketPort: number): ServerConnection {
  const retryBackoffMs = 5000                                                   // wait 5 seconds before trying to reconnect, then 10 seconds, then 15, etc
  const queue: Action[] = []
  const OPEN = 1
  let socket: WebSocket
  let retryCount = 0
  let resendThreshold = 10000                                                   // re-send messages if they have not been confirmed within ten seconds
  let open = true

  connect()

  /**
   * Event handlers
   */
  function onMessage (event: MessageEvent): void {
    const action = JSON.parse(event.data)
  }
  function onClose (): void {
    reconnect()
  }
  function onOpen (): void {
    retryCount = 0
    login()
  }
  function onLogin (): void {
    joinRooms()
  }
  function onJoinRoom (): void {
    sendPendingActions()
  }

  /**
   * Open a socket connection
   */
  function connect () {
    socket = new WebSocket(`ws://${serverUrl}`)
    socket.addEventListener('close', onClose)
    socket.addEventListener('open', onOpen)
    socket.addEventListener('message', onMessage)
  }

  /**
   * Wait a bit, and then call connect()
   */
  function reconnect () {
    if (!open) return
    retryCount++
    const delay = retryCount * retryBackoffMs
    setTimeout(connect, delay)
  }


  function login () {

  }

  function joinRooms () {

  }

  function sendPendingActions () {

  }

  /**
   * Try to send any pending messages through the socket connection
   */
  function sendQueue () {
    if (!open) return
    if (socket.readyState !== OPEN) return

    retryCount = 0
    const curMs = new Date().getTime()
    queue.forEach((action) => {
      const sentAtMs = action.sentAtMs || 0
      if (curMs - sentAtMs > resendThreshold) {
        action.sentAtMs = curMs
        const strAction = JSON.stringify(action)
        socket.send(strAction)
      }
    })
  }

  /**
   * Remove a confirmed action from the sendQueue
   */
  function pruneQueue (actionId: string) {
    let i = 0
    let len = queue.length
    while (i < len) {
      const action = queue[i]
      if (action.quantumId === actionId) {
        queue.splice(i, 1)
        len--
      }
      i++
    }
  }

  /**
   * Add a message to be sent
   */
  function send (action: Action): Promise<boolean> {
    queue.push()
    sendQueue()
    return Promise.resolve(true)
  }

  /**
   * Close this connection
   */
  function close () {
    open = false
    queue.length = 0
    if (socket.readyState === OPEN) socket.close()
  }

  /**
   * public methods
   */
  return {
    send,
    close
  }
}
