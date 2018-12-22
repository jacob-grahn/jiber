import { Settings } from '../settings'

/**
 * Try to create a connection to the server
 * @hidden
 */
export const tryToConnect = (settings: Settings): Promise<any> => {
  const { url, credential, backoffMs } = settings
  if (!url) return Promise.reject('NO_URL')

  return new Promise((resolve) => {
    const onopen = (socket: WebSocket) => {
      delete socket.onclose
      delete socket.onopen
      resolve(socket)
    }

    const connect = (retryCount = 0) => {
      const delay = retryCount * backoffMs
      setTimeout(() => {
        const socket = new WebSocket(url, credential)
        socket.onclose = () => connect(retryCount + 1)
        socket.onopen = () => onopen(socket)
      }, delay)
    }

    connect()
  })
}
