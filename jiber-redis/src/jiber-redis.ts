/**
 * Send incoming actions to redis stream
 * Read actions from subscribed streams, and send them on to next()
 */

import { Sender } from './sender'
import { Receiver } from './receiver'
import { JiberRedisSettings, JiberRedisInput } from './interfaces'
import { closeAllConnections } from './get-connection'

afterEach(() => {
  closeAllReceivers()
  closeAllConnections()
})

const defaultSettings: JiberRedisSettings = {
  host: '127.0.0.1',
  port: 6379,
  maxHistory: 1000,
  docId: 'defaultDocId'
}

interface Worker {
  sender: Sender,
  receiver: Receiver
}

const workers: {[key: string]: Worker} = {}

export const closeAllReceivers = () => {
  Object.keys(workers).forEach((docId: string) => {
    workers[docId].receiver.stop()
    delete workers[docId]
  })
}

export const jiberRedis = (input: JiberRedisInput) => (_state: any) => (next: Function) => {
  const settings = { ...defaultSettings, ...input }

  return (action: any) => {
    const docId = action.doc

    if (!workers[docId]) {
      const sender = new Sender(settings)
      const receiver = new Receiver(settings, next)
      const worker = { sender, receiver }
      workers[docId] = worker
      receiver.start()
    }

    const worker = workers[docId]
    worker.sender.send(action)
      .catch(() => setTimeout(() => worker.sender.send(action), 5000))
  }
}
