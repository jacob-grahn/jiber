import { Action } from 'jiber-core'
import * as WS from 'ws'
import { verifyClient } from './verify-client'
import { onConnect } from './on-connect'
import { ServerStore } from '../server-store'
import { sendToDoc } from './send-to-doc'
import { sendToUser } from './send-to-user'
import { logger } from '../utils/logger'

export interface SocketServer {
  start: () => void,
  stop: () => void,
  sendToUser: (uid: string, action: Action) => void,
  sendToDoc: (Id: string, action: Action) => void,
  socketLookup: {[key: string]: WS}
}

/**
 * Listen for incoming user actions
 */
export const createSocketServer = (store: ServerStore) => {
  let wss: WS.Server | undefined

  const socketLookup = {}

  const stop = () => {
    if (!wss) return
    wss.close()
    wss = undefined
  }

  const start = () => {
    stop()
    const { server, port } = store.settings
    wss = new WS.Server({
      server,
      port: server ? undefined : port,
      verifyClient: verifyClient(store)
    })
    wss.on('error', (err) => logger.error('wss error', err.message))
    wss.on('connection', onConnect(store.db.dispatch, socketLookup))
  }

  // some currying here sure would be nice
  return {
    start,
    stop,
    sendToDoc: (Id: string, action: Action) => {
      return sendToDoc(store, Id, action)
    },
    sendToUser: (uid: string, action: Action) => {
      return sendToUser(socketLookup, uid, action)
    },
    socketLookup
  }
}
