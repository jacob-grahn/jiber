export default function tryToConnect (
  createWebSocket: (url: string, credential: string) => WebSocket
) {
  return function (
    url: string,
    credential: any = undefined,
    backoffMs: number = 5000                                                    // wait 5 seconds before trying to reconnect, then 10 seconds, then 15, etc
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!url) reject('NO_SOCKET_URL')

      function connect (retryCount = 0) {
        const delay = retryCount * backoffMs
        setTimeout(() => {
          const socket = createWebSocket(url, credential)
          socket.onclose = () => connect(retryCount + 1)
          socket.onerror = (err) => reject(err)
          socket.onopen = () => onopen(socket)
        }, delay)
      }

      function onopen (socket: WebSocket) {
        delete socket.onclose
        delete socket.onerror
        delete socket.onopen
        resolve(socket)
      }

      connect()
    })
  }
}
