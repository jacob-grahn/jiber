import Member from './member'

export interface RoomState {
  private?: any,
  confirmed: any,
  members: {[userId: string]: Member},
  lastUpdatedAt: number
}

export default RoomState
