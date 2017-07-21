import { RoomState, Action } from '../../core/index'

interface ClientRoomState extends RoomState {
  optimistic: any,
  optimisticActions: Action[]
}

export default ClientRoomState
