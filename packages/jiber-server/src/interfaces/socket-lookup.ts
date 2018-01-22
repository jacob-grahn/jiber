import * as WS from 'ws'

export interface SocketLookup {
  [key: string]: WS
}
