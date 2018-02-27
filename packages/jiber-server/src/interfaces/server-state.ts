import { SocketServer } from '../socket-server'

export interface ServerState {
  socketServer: SocketServer,
  subscriptions: {[docId: string]: Set<string>}
}
