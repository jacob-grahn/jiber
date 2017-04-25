import { store } from './server'

export default function processMessage (socketId, message) {
  const time = new Date().getTime()
  store.commit(setLastReceivedAt(socketId, time))
}
