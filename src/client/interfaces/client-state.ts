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
      members: {[userId: string]: number},
      confirmedState: any,
      optimisticState: any,
      optimisticActions: HopeAction[]
      status: string,
      timeMs: number
    }
  },
  me: {
    userId: string,
    [key: string]: any
  }
}

export default ClientState
