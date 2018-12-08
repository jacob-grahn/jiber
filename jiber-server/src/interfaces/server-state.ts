import { SocketServer } from '../socket-server'
import { ServerSettings } from './server-settings'
import { Action } from './action'

export interface ServerState {
  settings: ServerSettings,
  socketServer: SocketServer,
  subscriptions: {[docId: string]: Set<string>},
  history: {[docId: string]: Action[]}
}
