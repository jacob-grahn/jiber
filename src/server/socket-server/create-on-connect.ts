import { Store } from '../../core/index'
import { socketInit, rateLimitOptions} from '../reducers/socket/socket'
import { ServerSettings } from '../interfaces/server-settings'
import * as ws from 'ws'

let nextId = 1

export default function createOnConnect (
  store: Store,
  settings: ServerSettings,
  onMessage: Function,
  onClose: Function,
  sendToSocket: Function
): (connection: ws) => void {
  return function onConnect (connection: ws): void {
    const socketId = (nextId++).toString()

    store.dispatch(socketInit(socketId, connection))
    store.dispatch(rateLimitOptions(socketId, settings.rateLimitPeriodMs, settings.rateLimit))

    connection.on('message', async (message) => {
      try {
        await onMessage(socketId, message)
      } catch (e) {
        sendToSocket(socketId, e.message)
      }
    })

    connection.on('close', () => {
      onClose(socketId)
    })
  }
}
