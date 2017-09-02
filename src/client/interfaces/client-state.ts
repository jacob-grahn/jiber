import { UserState } from '../../core/index'
import { ClientRoomState } from './client-room-state'

/**
 * Overview of what state the client will store
 */
export interface ClientState {
  users: {
    [userId: string]: UserState
  },
  rooms: {
    [roomId: string]: ClientRoomState
  },
  me: UserState
}
