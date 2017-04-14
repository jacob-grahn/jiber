import sendToServer from './middleware/send-to-server'
import sendToPeers from './middleware/send-to-peers'
import injectMetadata from './middleware/injectMetadata'
import { createStore } from '../core'

/**
 * When creating a client store, add middleware to send actions to the server
 * and peers
 * @param  {Object} [options={}]  Config options
 * @return {Store}                Shared data store
 */
export default function createClientStore (options = {}) {
  const middleware = options.middleware || []
  const clientMiddleware = [
    ...middleware,
    injectMetadata,
    sendToServer(options.server),
    sendToPeers(options.server)
  ]
  const clientOptions = {
    ...options,
    middleware: clientMiddleware
  }
  return createStore(clientOptions)
}
