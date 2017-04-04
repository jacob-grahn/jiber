/**
 * Attepts to keep an open connection with the specified server
 * Messages are held in a queue until the server sends back a confirmation
 * @param  {string} server      target server to connect to
 * @return {ServerConnection}   an interface to send messages to the server
 */
export default function serverConnection (server) {
  let socket
  let connectTimeout
  let retryCount = 0
  let resendThreshold = 10000                                                   // re-send messages if they have not been confirmed within ten seconds
  const queue = []

  connect()

  function connect () {
    socket = new window.WebSocket(`ws://${server}`)
    socket.addEventListener('close', reconnect)
    socket.addEventListener('open', sendQueue)
  }

  function reconnect () {
    if (connectTimeout) return
    retryCount++
    const delay = retryCount * 5000
    connectTimeout = setTimeout(connect, delay)
  }

  function sendQueue () {
    if (socket && socket.readyState !== 1) return

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
}
