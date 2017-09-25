import { UserDict, User } from 'jiber-core'
import { ClientRoomState } from '../reducers/client-room/client-room'

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
