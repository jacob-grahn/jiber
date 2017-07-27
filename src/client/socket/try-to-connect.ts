import ClientSettings from '../interfaces/client-settings'

export default function tryToConnect (
  createWebSocket: (url: string, credential: string) => WebSocket,
  {url, socketPort, credential, backoffMs}: ClientSettings
) {
  return function (): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!url) reject('NO_SOCKET_URL')

      function connect (retryCount = 0) {
        const delay = retryCount * backoffMs
        setTimeout(() => {
          const fullUrl = `ws://${url}:${socketPort}`
          const socket = createWebSocket(fullUrl, credential)
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
