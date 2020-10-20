/**
 * Send incoming actions to redis stream
 * Read actions from subscribed streams, and send them on to next()
 */
import { JiberRedisSettings, JiberRedisInput } from './interfaces'
import { defaultSettings } from './default-settings'
import { DocWorker } from './doc-worker'
import { closeAllConnections } from './get-connection'
export { closeAllConnections } from './get-connection'

// TODO: this is a hack
const closeFuncs: Function[] = []

export const jiberRedis = (input: JiberRedisInput) => (server: any) => (next: Function) => {
  const settings: JiberRedisSettings = { ...defaultSettings, ...input }
  const workers: {[key: string]: DocWorker} = {}
  
  // register a function to close all of these redis workers...
  const close = () => {
    Object.values(workers).forEach((worker) => {
      worker.stop()
    })
  }
  closeFuncs.push(close)

  // middleware
  return (action: any) => {
    const docId = action.doc
    if (!docId) {
      return
    }

    if (!workers[docId]) {
      const worker = new DocWorker({ ...settings, docId }, server, next)
      workers[docId] = worker
    }

    const worker = workers[docId]
    worker.send(action)
  }
}

export const closeJiberRedis = () => {
  closeFuncs.forEach(func => func())
  closeAllConnections()
}
