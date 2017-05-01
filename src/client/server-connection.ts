import { Action } from '../core'

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
   * Open a socket connection
   */
  function connect () {
    socket = new WebSocket(`ws://${server}`)
    socket.addEventListener('close', reconnect)
    socket.addEventListener('open', sendQueue)
    socket.addEventListener('message', handleMessage)
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
   * @type {String} message JSON encoded action
   */
  function pruneQueue (actionId) {
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
   * Process incomming messages from the socket
   * @type {String} message JSON encoded action
   */
  function handleMessage (message) {
    const action = JSON.parse(message)
    pruneQueue(action.quantumId)
  }

  /**
   * Add a message to be sent
   */
  function send (action) {
    queue.push()
    sendQueue()
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
