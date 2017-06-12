import { Store } from '../../core/index'
import { socketInit, socketSend } from '../reducers/socket'
import * as ws from 'ws'

let nextId = 1

export default function createOnConnect (
  store: Store,
  onMessage: Function,
  onClose: Function
): (connection: ws) => void {
  return function onConnect (connection: ws): void {
    const socketId = (nextId++).toString()

    store.dispatch(socketInit(socketId, connection))

    connection.on('message', async (message) => {
      try {
        await onMessage(socketId, message)
      } catch (e) {
        store.dispatch(socketSend(e.message))
      }
    })

    connection.on('close', () => {
      onClose(socketId)
    })
  }
}
