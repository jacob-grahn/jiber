import { RoomState } from '../../core/index'
import Socket from './socket'

interface ServerState {
  sockets: {
    [socketId: string]: {
      connection: Socket,
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
