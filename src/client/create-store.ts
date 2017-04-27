import sendToServer from './middleware/send-to-server'
import sendToPeers from './middleware/send-to-peers'
import injectMetadata from './middleware/inject-metadata'
import optimistic from './reducers/optimistic'
import simpleSetter from '../core/reducers/simple-setter'
import store from '../core/store'
import { Middleware, Store, Reducer } from '../core'
import ClientOptions from './interfaces/client-options'


/**
 * When creating a client store, add middleware to send actions to the server
 * and peers
 */
export default function createStore (options: ClientOptions = {}): Store {
  const serverOptions = options.server || {}
  const middleware = options.middleware || []
  const reducer = options.reducer || simpleSetter
  const optimisticReducer = optimistic(reducer)
  const clientMiddleware = [
    ...middleware,
    injectMetadata,
    sendToServer(serverOptions),
    sendToPeers(serverOptions)
  ]
  return store(reducer, clientMiddleware)
}
