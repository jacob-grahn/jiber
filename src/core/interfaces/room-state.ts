import { UserDict } from './user-dict'

export interface RoomState {
  private?: any,
  confirmed: any,
  members: UserDict,
  lastUpdatedAt: number
}
