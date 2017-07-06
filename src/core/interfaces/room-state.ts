export interface RoomState {
  confirmedState: any,
  members: {[userId: string]: {actionId: number}},
  lastUpdatedAt: number
}

export default RoomState
