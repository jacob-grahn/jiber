export interface RoomState {
  confirmedState: any,
  actionIds: {[key: string]: number},
  lastUpdatedAt: number
}

export default RoomState
