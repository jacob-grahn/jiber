import { RoomState } from '../../core/index'
import * as ws from 'ws'

interface ServerState {
  sockets: {
    [socketId: string]: {
      connection: ws,
      connectedAt: number,
      userId: string
    }
  },
  users: {
    [userId: string]: {
      socketId: string,
      public: {userId: string, [key: string]: any},
      private: any
    }
  },
  rooms: {
    [roomId: string]: RoomState
  }
}

export default ServerState
