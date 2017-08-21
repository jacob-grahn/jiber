import { UserState } from '../../core/index'
import { ClientRoomState } from './client-room-state'

export interface ClientState {
  users: {
    [userId: string]: UserState
  },
  rooms: {
    [roomId: string]: ClientRoomState
  },
  me: UserState
}
