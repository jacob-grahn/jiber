import { UserDict, User } from 'jiber-core'
import { ClientRoomState } from './client-room-state'

/**
 * Overview of what state the client will store
 */
export interface ClientState {
  users: UserDict,
  rooms: {
    [roomId: string]: ClientRoomState
  },
  me: User
}
