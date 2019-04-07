/**
 * Send incoming actions to redis stream
 * Read actions from subscribed streams, and send them on to next()
 */
import { JiberRedisSettings, JiberRedisInput } from './interfaces'
import { closeAllConnections } from './get-connection'
import { defaultSettings } from './default-settings'
import { DocWorker } from './doc-worker'

afterEach(() => {
  closeAllReceivers()
  closeAllConnections()
})

const workers: {[key: string]: DocWorker} = {}

export const closeAllReceivers = () => {
  Object.keys(workers).forEach((docId: string) => {
    workers[docId].stop()
    delete workers[docId]
  })
}

export const jiberRedis = (input: JiberRedisInput) => (server: any) => (next: Function) => {
  const settings: JiberRedisSettings = { ...defaultSettings, ...input }

  return (action: any) => {
    const docId = action.doc

    if (!workers[docId]) {
      const worker = new DocWorker(settings, server, next)
      workers[docId] = worker
    }

    const worker = workers[docId]
    worker.send(action)
  }
}
