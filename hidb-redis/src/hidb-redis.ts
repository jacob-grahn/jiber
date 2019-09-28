/**
 * Send incoming actions to redis stream
 * Read actions from subscribed streams, and send them on to next()
 */
import { HiDBRedisSettings, HiDBRedisInput } from './interfaces'
import { defaultSettings } from './default-settings'
import { DocWorker } from './doc-worker'
export { closeAllConnections } from './get-connection'

export const hidbRedis = (input: HiDBRedisInput) => (server: any) => (next: Function) => {
  const settings: HiDBRedisSettings = { ...defaultSettings, ...input }
  const workers: {[key: string]: DocWorker} = {}

  return (action: any) => {
    const docId = action.doc

    if (!workers[docId]) {
      const worker = new DocWorker({ ...settings, docId }, server, next)
      workers[docId] = worker
    }

    const worker = workers[docId]
    worker.send(action)
  }
}
