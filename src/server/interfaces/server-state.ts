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
      public: {userId: string, [key: string]: any},
      private: any
    }
  },
  rooms: {
    [roomId: string]: {
      actionIds: {[userId: string]: number},
      isUpdating: boolean,
      needsUpdate: boolean,
      lastUpdatedAt: number,
      confirmedState: any
    }
  }
}

export default ServerState
