import { HopeAction } from '../../core/index'

interface ClientState {
  users: {
    [userId: string]: {
      userId: string,
      [key: string]: any
    }
  },
  rooms: {
    [roomId: string]: {
      actionIds: {[userId: string]: number},
      confirmedState: any,
      optimisticState: any,
      optimisticActions: HopeAction[]
      status: string,
      lastUpdatedAt: number
    }
  },
  me: {
    userId: string,
    [key: string]: any
  }
}

export default ClientState
