import onMessage from './on-message'
import onClose from './on-close'
import { socketInit, socketSend } from '../reducers/socket'
import store from '../store'
import * as ws from 'ws'

let nextId = 1

/**
 * Set up a new connection with event listeners
 */
export default function onNewConnection (connection: ws): void {
  const socketId = (nextId++).toString()

  store.commit(socketInit(socketId, connection))

  connection.on('message', async (message) => {
    try {
      await onMessage(socketId, message)
    } catch (e) {
      console.log(e)
      socketSend(e.message)
    }
  })

  connection.on('close', () => {
    onClose(socketId)
  })
}
