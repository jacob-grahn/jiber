import sendToServer from './middleware/send-to-server'
import sendToPeers from './middleware/send-to-peers'
import injectMetadata from './middleware/inject-metadata'
import optimistic from './reducers/optimistic'
import simpleSetter from '../core/reducers/simple-setter'
import store from '../core/store'
import { IMiddleware } from '../core/i-middleware'
import { IStore } from '../core/i-store'
import { IReducer } from '../core/i-reducer'

interface IServerOptions {
  url: string
}

interface IClientOptions {
  reducer?: IReducer,
  middleware?: Array<IMiddleware>,
  server?: IServerOptions
}

/**
 * When creating a client store, add middleware to send actions to the server
 * and peers
 */
export default function createStore (options: IClientOptions = {}): IStore {
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
