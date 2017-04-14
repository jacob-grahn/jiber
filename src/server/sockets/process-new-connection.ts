import processMessage from './process-message'
import processClose from './process-close'
import { setConnection } from './client/client-actions'
import { store } from './server'

let nextId = 1

export default function processNewConnection (connection) {
  const socketId = nextId++

  store.commit(setConnection(socketId, connection))

  connection.on('message', message => {
    processMessage(socketId, message)
  })

  connection.on('close', () => {
    processClose(socketId)
  })
}
