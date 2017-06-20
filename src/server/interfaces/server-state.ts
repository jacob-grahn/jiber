import Socket from './socket'

interface ServerState {
  sockets: {
    [socketId: string]: {
      connection: Socket,
      connectedAt: number,
      lastReceivedAt: number,
      lastSentAt: number,
      rateLimit: {
        periodDuration: number,
        period: number,
        total: number
      }
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
      confirmedState: any
    }
  }
}

export default ServerState
