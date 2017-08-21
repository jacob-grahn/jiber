import { RoomState, Action } from '../../core/index'

export interface ClientRoomState extends RoomState {
  optimistic: any,
  optimisticActions: Action[]
}
