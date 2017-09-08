import { RoomState, UserDict } from '../core'
import * as ws from 'ws'

export interface ServerState {
  sockets: {
    [socketId: string]: {
      connection: ws,
      connectedAt: number,
      userId: string
    }
  },
  users: UserDict,
  rooms: {
    [roomId: string]: RoomState
  }
}
