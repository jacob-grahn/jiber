import { ClientSettings } from '../interfaces/client-settings'

/**
 * Try to create a connection to the server
 */
export const createTryToConnect = (
  {url, socketPort, credential, backoffMs}: ClientSettings
) => {
  return (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!url) reject('NO_SOCKET_URL')

      const onopen = (socket: WebSocket) => {
        delete socket.onclose
        delete socket.onopen
        resolve(socket)
      }

      const connect = (retryCount = 0) => {
        const delay = retryCount * backoffMs
        setTimeout(() => {
          const fullUrl = `ws://${url}:${socketPort}`
          const socket = new WebSocket(fullUrl, credential)
          socket.onclose = () => connect(retryCount + 1)
          socket.onopen = () => onopen(socket)
        }, delay)
      }

      connect()
    })
  }
}
